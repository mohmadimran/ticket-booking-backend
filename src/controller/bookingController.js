const bookingsService = require('../servicess/bookingServices');



// GET /api/bookings  --> List all bookings for admin

async function listBookings(req, res) {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const bookings = await bookingsService.listBookings();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

// confirm booking by admin

async function confirmBooking(req,res){
 try {

        const booking =
            await bookingsService.confirmBooking(req.params.id);

        res.json(booking);

    } catch (err) {

        res.status(400).json({
            error: err.message
        });

    }

}

async function rejectBooking(req,res) {
    try {

        const booking =
            await bookingsService.rejectBooking(req.params.id);

        res.json(booking);

    } catch (err) {

        res.status(400).json({
            error: err.message
        });

    }

}


// -----------------------------------------------
// POST /api/bookings/:showId  --> Create booking by user
// -----------------------------------------------

async function createBooking(req, res) {
  try {
    const { showId } = req.params;
    const { seats } = req.body;

    console.log("get params id", showId)
    console.log("get params seat", seats)

    if (!Number.isInteger(seats) || seats <= 0) {
      return res.status(400).json({
        error: "Seats must be greater than 0",
      });
    }

    const booking = await bookingsService.createBooking({
      showId,
      userId: req.user.id,
      userName: req.user.name,
      seats,
    });

    res.status(201).json({
      message: "Booking created successfully.",
      booking,
    });
  }
   catch (err) {
    console.error(err);

    res.status(err.status || 500).json({
      error: err.message || "Internal Server Error",
    });
  }
}

// get user all bookings
async function getMyBookings(req, res) {
  try {
    const bookings = await bookingsService.getMyBookings(req.user.id);

    res.json(bookings);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Internal server error",
    });
  }
}

async function updateBooking(req, res) {
  try {
    const booking = await bookingsService.getBooking(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updated = await bookingsService.updateBooking(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function cancelBooking(req, res) {
// console.log("Booking ID:", req.params.id);
// console.log("User:", req.user);

  try {
    const booking = await bookingsService.cancelBooking(
      req.params.id,
      req.user.id
    );

    if (!booking) {
      return res.status(404).json({
        error: "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully.",
      booking,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }
}


module.exports = {
  listBookings,
  confirmBooking,
  rejectBooking,
  createBooking,
  getMyBookings,
  updateBooking,
  cancelBooking
};
