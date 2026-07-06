const express = require("express");
const router = express.Router();

const bookingsController = require("../controller/bookingController");

const {
  authenticate,
  authorize,
} = require("../midellware/auth");

/* ===========================
   ADMIN ROUTES
=========================== */

// Get all bookings
router.get(
  "/bookings",
  authenticate,
  authorize("ADMIN"),
  bookingsController.listBookings
);

// Confirm booking
router.post(
  "/bookings/:id/confirm",
  authenticate,
  authorize("ADMIN"),
  bookingsController.confirmBooking
);

// Fail booking
// router.post(
//   "/bookings/:id/cancel",
//   authenticate,
//   authorize("ADMIN"),
//   bookingsController.failBooking
// );
router.delete(
  "/bookings/:id",
  authenticate,
  authorize("ADMIN"),
  bookingsController.cancelBooking
);

/* ===========================
   USER ROUTES
=========================== */

// Create booking
router.post(
  "/bookings/:showId",
  authenticate,
  authorize("USER"),
  bookingsController.createBooking
);

// My bookings
router.get(
  "/my-bookings",
  authenticate,
  authorize("USER"),
  bookingsController.getMyBookings
);

// Booking details
router.get(
  "/bookings/:id",
  authenticate,
  bookingsController.getBooking
);

// Update booking
router.put(
  "/bookings/:id",
  authenticate,
  authorize("USER"),
  bookingsController.updateBooking
);

// Cancel booking
router.delete(
  "/bookings/:id",
  authenticate,
  authorize("USER"),
  bookingsController.cancelBooking
);

module.exports = router;