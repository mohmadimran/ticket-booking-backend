const express = require('express');
const router = express.Router();
const bookingsController = require('../controller/bookingController');
const { authenticate, authorize } = require('../midellware/auth');

// ADMIN → view all bookings
router.get(
  'bookings/',
  authenticate,
  authorize('ADMIN'),
  bookingsController.listBookings
);

// USER / ADMIN → get specific booking (ownership check in controller)
router.get(
  '/booking/:id',
  authenticate,
  bookingsController.getBooking
);

// USER → create booking
router.post(
  'booking/:showId',
  authenticate,
  authorize('USER'),
  bookingsController.createBooking
);

// USER → confirm booking (payment)
router.post(
  '/booking/:id/confirm',
  authenticate,
  authorize('USER'),
  bookingsController.confirmBooking
);

// USER → fail booking
router.post(
  '/booking/:id/fail',
  authenticate,
  authorize('USER'),
  bookingsController.failBooking
);

// USER → update booking (name only)
router.put(
  '/booking/:id',
  authenticate,
  authorize('USER'),
  bookingsController.updateBooking
);

// USER → cancel booking
router.delete(
  '/booking/:id',
  authenticate,
  authorize('USER'),
  bookingsController.cancelBooking
);

module.exports = router;
