const express = require('express');
const router = express.Router();
const bookingsController = require('../controller/bookingController');
const { authenticate, authorize } = require('../midellware/auth');

// ADMIN → view all bookings
router.get(
  '/',
  authenticate,
  authorize('ADMIN'),
  bookingsController.listBookings
);

// USER / ADMIN → get specific booking (ownership check in controller)
router.get(
  '/:id',
  authenticate,
  bookingsController.getBooking
);

// USER → create booking
router.post(
  '/:showId',
  authenticate,
  authorize('USER'),
  bookingsController.createBooking
);

// USER → confirm booking (payment)
router.post(
  '/:id/confirm',
  authenticate,
  authorize('USER'),
  bookingsController.confirmBooking
);

// USER → fail booking
router.post(
  '/:id/fail',
  authenticate,
  authorize('USER'),
  bookingsController.failBooking
);

// USER → update booking (name only)
router.put(
  '/:id',
  authenticate,
  authorize('USER'),
  bookingsController.updateBooking
);

// USER → cancel booking
router.delete(
  '/:id',
  authenticate,
  authorize('USER'),
  bookingsController.cancelBooking
);

module.exports = router;
