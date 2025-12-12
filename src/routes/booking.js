const express = require('express');
const router = express.Router();
const bookingsController = require('../controller/bookingController');

// GET /api/bookings - List all bookings
router.get('/', bookingsController.listBookings);

// GET /api/bookings/:id - Get specific booking
router.get('/:id', bookingsController.getBooking);

// POST /api/bookings/:showId - Create booking for show
router.post('/:showId', bookingsController.createBooking);

// POST /api/bookings/:id/confirm - Confirm booking (payment)
router.post('/:id/confirm', bookingsController.confirmBooking);

// POST /api/bookings/:id/fail - Mark as failed
router.post('/:id/fail', bookingsController.failBooking);

// PUT /api/bookings/:id - Update booking
router.put('/:id', bookingsController.updateBooking);

// DELETE /api/bookings/:id - Cancel booking
router.delete('/:id', bookingsController.cancelBooking);

module.exports = router;