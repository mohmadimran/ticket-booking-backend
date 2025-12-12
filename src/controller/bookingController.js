const bookingsService = require('../servicess/bookingServices');

// -----------------------------------------------
// GET /api/bookings  --> List all bookings
// -----------------------------------------------
async function listBookings(req, res) {
  try {
    const bookings = await bookingsService.listBookings();
    res.json(bookings);
  } catch (err) {
    console.error("Error listing bookings:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// -----------------------------------------------
// GET /api/bookings/:id --> Get a booking by ID
// -----------------------------------------------
async function getBooking(req, res) {
  try {
    const { id } = req.params;
    const booking = await bookingsService.getBooking(id);

    if (!booking) return res.status(404).json({ error: "Booking not found" });

    res.json(booking);
  } catch (err) {
    console.error("Error fetching booking:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// -----------------------------------------------
// POST /api/bookings/:showId  --> Create booking
// -----------------------------------------------
async function createBooking(req, res) {
  try {
    const { showId } = req.params;
    const { user_name, seats } = req.body;

    if (!user_name || !seats)
      return res.status(400).json({ error: "user_name and seats are required" });

    if (typeof seats !== "number" || seats <= 0)
      return res.status(400).json({ error: "seats must be a positive number" });

    const booking = await bookingsService.createBooking({
      showId,
      userName: user_name,
      seats
    });

    res.status(201).json(booking);

  } catch (err) {
    console.error("Error creating booking:", err);
    const status = err.status || 500;
    res.status(status).json({ error: err.message || "Internal server error" });
  }
}

// -----------------------------------------------
// POST /api/bookings/:id/confirm --> Confirm booking
// -----------------------------------------------
async function confirmBooking(req, res) {
  try {
    const { id } = req.params;
    const updated = await bookingsService.confirmBooking(id);

    res.json(updated);
  } catch (err) {
    console.error("Error confirming booking:", err);
    const status = err.status || 500;
    res.status(status).json({ error: err.message || "Internal server error" });
  }
}

// -----------------------------------------------
// POST /api/bookings/:id/fail --> Mark booking failed
// -----------------------------------------------
async function failBooking(req, res) {
  try {
    const { id } = req.params;
    const updated = await bookingsService.failBooking(id);

    res.json(updated);
  } catch (err) {
    console.error("Error marking booking as failed:", err);
    const status = err.status || 500;
    res.status(status).json({ error: err.message || "Internal server error" });
  }
}

// -----------------------------------------------
// PUT /api/bookings/:id --> Update booking
// -----------------------------------------------
async function updateBooking(req, res) {
  try {
    const { id } = req.params;

    const updated = await bookingsService.updateBooking(id, req.body);
    if (!updated) return res.status(404).json({ error: "Booking not found" });

    res.json(updated);
  } catch (err) {
    console.error("Error updating booking:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// -----------------------------------------------
// DELETE /api/bookings/:id --> Cancel a booking
// -----------------------------------------------
async function cancelBooking(req, res) {
  try {
    const { id } = req.params;
    const deleted = await bookingsService.cancelBooking(id);

    if (!deleted) return res.status(404).json({ error: "Booking not found" });

    res.json({ message: "Booking cancelled successfully" });

  } catch (err) {
    console.error("Error cancelling booking:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  listBookings,
  getBooking,
  createBooking,
  confirmBooking,
  failBooking,
  updateBooking,
  cancelBooking
};
