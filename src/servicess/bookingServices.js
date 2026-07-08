const Show = require('../models/Show');
const Booking = require('../models/Booking');


//------------------------------------------------------
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
// CONFIRM BOOKING (Payment success)
// ------------------------------------------------------

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
  catch (err) {
    await Show.findByIdAndUpdate(showId, {
      $inc: {
        reservedSeats: -seats,
      },
    });

    throw {
      status: 500,
      message: "Failed to create booking",
    };
  }
 }
//  get my booking to the user
async function getMyBookings(userId) {
  return Booking.find({ userId })
    .populate("showId")
    .sort({ createdAt: -1 });
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


// async function cancelBooking(bookingId, userId) {
//   console.log("bookingId:", bookingId);
// console.log("userId:", userId);
  
//   // Find booking
//   const booking = await Booking.findById(bookingId);

//   if (!booking) {
//     return null;
//   }

//   // Check booking ownership
//   if (booking.userId.toString() !== userId) {
//     throw new Error("You are not authorized to cancel this booking.");
//   }

//   // Only pending bookings can be cancelled
//   if (booking.status !== "PENDING") {
//     throw new Error("Only pending bookings can be cancelled.");
//   }

//   // Update booking status
//   booking.status = "CANCELLED";
//   await booking.save();

//   // Release reserved seats
//   await Show.findByIdAndUpdate(
//     booking.showId,
//     {
//       $inc: {
//         reservedSeats: -booking.seats,
//       },
//     },
//     { new: true }
//   );

//   return booking;
// }



async function cancelBooking(bookingId, userId) {
  // console.log("bookingId:", bookingId);
  // console.log("Logged In User:", userId);

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    return null;
  }

  console.log("Booking Owner:", booking.userId.toString()); // <-- Add this

  if (booking.userId.toString() !== userId.toString()) {
    throw new Error("You are not authorized to cancel this booking.");
  }

  if (booking.status !== "PENDING") {
    throw new Error("Only pending bookings can be cancelled.");
  }

  booking.status = "CANCELLED";
  await booking.save();

  await Show.findByIdAndUpdate(
    booking.showId,
    {
      $inc: {
        reservedSeats: -booking.seats,
      },
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


module.exports = {
  createBooking,
  getMyBookings,
  confirmBooking,
  listBookings,
  updateBooking,
  cancelBooking,
  findAndFailExpiredBookings,
  rejectBooking
};
