const Show = require('../models/Show');
const Booking = require('../models/Booking');

// ------------------------------------------------------
// CREATE BOOKING  (Atomic seat reservation)
// ------------------------------------------------------
async function createBooking({
  showId,
  userId,
  userName,
  seats,
}) {
  if (seats <= 0) {
    throw {
      status: 400,
      message: "Seats must be greater than zero",
    };
  }

  const filter = {
    _id: showId,
    $expr: {
      $gte: [
        {
          $subtract: [
            "$totalSeats",
            {
              $add: [
                "$reservedSeats",
                "$confirmedSeats",
              ],
            },
          ],
        },
        seats,
      ],
    },
  };

  const update = {
    $inc: {
      reservedSeats: seats,
    },
  };

  const updatedShow = await Show.findOneAndUpdate(
    filter,
    update,
    {
      new: true,
    }
  );

  if (!updatedShow) {
    throw {
      status: 409,
      message: "Not enough seats available.",
    };
  }

  try {
    const booking = await Booking.create({
      showId,
      userId,
      userName,
      seats,
      status: "PENDING",
    });

    return booking;
  } 
  // catch (err) {
  //   await Show.findByIdAndUpdate(showId, {
  //     $inc: {
  //       reservedSeats: -seats,
  //     },
  //   });

  //   throw {
  //     status: 500,
  //     message: "Failed to create booking",
  //   };
  // }
  catch (err) {
    console.log("dfine schema error",err);

    await Show.findByIdAndUpdate(showId,{
        $inc:{
            reservedSeats:-seats
        }
    });

    throw err;
}
}
//  get my booking 
async function getMyBookings(userId) {
  return Booking.find({ userId })
    .populate("showId")
    .sort({ createdAt: -1 });
}
// ------------------------------------------------------
// CONFIRM BOOKING (Payment success)
// ------------------------------------------------------
// async function confirmBooking(bookingId) {
//   const booking = await Booking.findOneAndUpdate(
//     { _id: bookingId, status: 'PENDING' },
//     { $set: { status: 'CONFIRMED', updatedAt: new Date() } },
//     { new: true }
//   ).exec();

//   if (!booking) throw { status: 400, message: 'Booking not found or not PENDING' };

//   await Show.findByIdAndUpdate(
//     booking.showId,
//     { $inc: { reservedSeats: -booking.seats, confirmedSeats: booking.seats } }
//   ).exec();

//   return booking.toObject();
// }
async function confirmBooking(id) {

    const booking = await Booking.findById(id);

    if (!booking)
        throw new Error("Booking not found");

    if (booking.status !== "PENDING")
        throw new Error("Booking already processed");

    booking.status = "CONFIRMED";

    await booking.save();

    await Show.findByIdAndUpdate(
        booking.showId,
        {
            $inc: {
                reservedSeats: -booking.seats,
                confirmedSeats: booking.seats
            }
        }
    );

    return booking;

}
// ------------------------------------------------------
// FAIL BOOKING (Payment failed)
// ------------------------------------------------------
async function failBooking(bookingId) {
  const booking = await Booking.findOneAndUpdate(
    { _id: bookingId, status: 'PENDING' },
    { $set: { status: 'FAILED', updatedAt: new Date() } },
    { new: true }
  ).exec();

  if (!booking) {
    const existing = await Booking.findById(bookingId).lean().exec();
    if (!existing) throw { status: 404, message: 'Booking not found' };
    return existing;
  }

  await Show.findByIdAndUpdate(
    booking.showId,
    { $inc: { reservedSeats: -booking.seats } }
  ).exec();

  return booking.toObject();
}

// ------------------------------------------------------
// GET BOOKING BY ID
// ------------------------------------------------------
async function getBooking(bookingId) {
  return Booking.findById(bookingId).lean().exec();
}

// ------------------------------------------------------
// LIST ALL BOOKINGS
// ------------------------------------------------------


async function listBookings() {
  return Booking.find()
    .populate({
      path: "showId",
      select: "name startTime",
    })
    .populate({
      path: "userId",
      select: "name email",
    })
    .sort({ createdAt: -1 })
    .lean()
    .exec();
}

// ------------------------------------------------------
// UPDATE BOOKING (Only metadata, not seat logic)
// ------------------------------------------------------
// In bookingsService.js
async function updateBooking(bookingId, data) {
  const allowed = ['userName', 'seats']; // Add 'seats'
  
  const updateData = {};
  for (const key of allowed) {
    if (data[key] !== undefined) updateData[key] = data[key];
  }
  
  // Handle user_name to userName conversion
  if (data.user_name !== undefined) {
    updateData.userName = data.user_name;
  }
  
  updateData.updatedAt = new Date();
  return Booking.findByIdAndUpdate(bookingId, updateData, { new: true }).lean().exec();
}

// ------------------------------------------------------
// CANCEL BOOKING (Fully reverse seat reservation/confirm)
// ------------------------------------------------------
// async function cancelBooking(bookingId) {
//   const booking = await Booking.findById(bookingId).exec();
//   if (!booking) return null;

//   // reverse seats depending on status
//   if (booking.status === 'PENDING') {
//     await Show.findByIdAndUpdate(
//       booking.showId,
//       { $inc: { reservedSeats: -booking.seats } }
//     );
//   }

//   if (booking.status === 'CONFIRMED') {
//     await Show.findByIdAndUpdate(
//       booking.showId,
//       { $inc: { confirmedSeats: -booking.seats } }
//     );
//   }

//   return Booking.findByIdAndDelete(bookingId).lean().exec();
// }
async function cancelBooking(id, userId) {

    const booking = await Booking.findById(id);

    if (!booking)
        return null;

    if (booking.userId.toString() !== userId)
        throw new Error("Forbidden");

    if (booking.status !== "PENDING")
        throw new Error(
            "Only pending bookings can be cancelled."
        );

    booking.status = "CANCELLED";

    await booking.save();

    await Show.findByIdAndUpdate(
        booking.showId,
        {
            $inc: {
                reservedSeats: -booking.seats
            }
        }
    );

    return booking;

}

// ------------------------------------------------------
// AUTO FAIL EXPIRED BOOKINGS
// ------------------------------------------------------
async function findAndFailExpiredBookings(expirySeconds = 120) {
  const cutoff = new Date(Date.now() - expirySeconds * 1000);

  const pending = await Booking.find({
    status: 'PENDING',
    createdAt: { $lt: cutoff }
  }).select('_id').lean().exec();

  for (const b of pending) {
    try {
      await failBooking(b._id);
      console.log(`Expired booking ${b._id} -> FAILED`);
    } catch (err) {
      console.error('Error failing expired booking', b._id, err);
    }
  }
}

async function rejectBooking(id) {

    const booking = await Booking.findById(id);

    if (!booking)
        throw new Error("Booking not found");

    if (booking.status !== "PENDING")
        throw new Error("Booking already processed");

    booking.status = "FAILED";

    await booking.save();

    await Show.findByIdAndUpdate(
        booking.showId,
        {
            $inc: {
                reservedSeats: -booking.seats
            }
        }
    );

    return booking;

}
module.exports = {
  createBooking,
  getMyBookings,
  confirmBooking,
  failBooking,
  getBooking,
  listBookings,
  updateBooking,
  cancelBooking,
  findAndFailExpiredBookings,
  rejectBooking
};
