const bookingsService = require('../servicess/bookingServices');

// -----------------------------------------------
// GET /api/bookings  --> List all bookings
// -----------------------------------------------
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


// -----------------------------------------------
// GET /api/bookings/:id --> Get a booking by ID
// -----------------------------------------------
async function getBooking(req, res) {
  try {
    const booking = await bookingsService.getBooking(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    if (
      booking.userId.toString() !== req.user.id &&
      req.user.role !== 'ADMIN'
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
}

// -----------------------------------------------
// POST /api/bookings/:showId  --> Create booking
// -----------------------------------------------

async function createBooking(req, res) {
  try {
    const { showId } = req.params;
    const { seats } = req.body;

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
  } catch (err) {
    console.error(err);

    res.status(err.status || 500).json({
      error: err.message || "Internal Server Error",
    });
  }
}

// get user booking
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

// -----------------------------------------------
// POST /api/bookings/:id/confirm --> Confirm booking
// -----------------------------------------------
async function confirmBooking(req, res) {
  try {
    const booking = await bookingsService.getBooking(req.params.id);

    if (!booking) return res.status(404).json({ error: "Booking not found" });

    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const updated = await bookingsService.confirmBooking(req.params.id);
    res.json(updated);

  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

// -----------------------------------------------
// POST /api/bookings/:id/fail --> Mark booking failed
// -----------------------------------------------
async function failBooking(req, res) {
  try {
    const booking = await bookingsService.getBooking(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updated = await bookingsService.failBooking(req.params.id);
    res.json(updated);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

// -----------------------------------------------
// PUT /api/bookings/:id --> Update booking
// -----------------------------------------------
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


// -----------------------------------------------
// DELETE /api/bookings/:id --> Cancel a booking
// -----------------------------------------------
async function cancelBooking(req, res) {
  try {
    const booking = await bookingsService.getBooking(req.params.id);

    if (!booking) return res.status(404).json({ error: "Booking not found" });

    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await bookingsService.cancelBooking(req.params.id);
    res.json({ message: "Booking cancelled successfully" });

  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
}


module.exports = {
  listBookings,
  getBooking,
  createBooking,
  getMyBookings,
  confirmBooking,
  failBooking,
  updateBooking,
  cancelBooking
};
