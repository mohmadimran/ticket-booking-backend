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
  "/admin/",
  authenticate,
  authorize("ADMIN"),
  bookingsController.listBookings
);

// Confirm booking
router.post(
  "/admin/:id",
  authenticate,
  authorize("ADMIN"),
  bookingsController.confirmBooking
);

// cancle booking

router.post(
  "/admin/:id",
  authenticate,
  authorize("ADMIN"),
  bookingsController.failBooking
);
router.delete(
  "/admin/:id",
  authenticate,
  authorize("ADMIN"),
  bookingsController.cancelBooking
);

/* ===========================
   USER ROUTES
=========================== */

// Create booking
router.post(
  "/user/:showId",
  authenticate,
  authorize("USER"),
  bookingsController.createBooking
);

// My bookings
router.get(
  "/user/my-bookings",
  authenticate,
  authorize("USER"),
  bookingsController.getMyBookings
);

// Booking details
router.get(
  "/user/:id",
  authenticate,
  authorize("USER"),
  bookingsController.getBooking
);

// Update booking
router.put(
  "/user/:id",
  authenticate,
  authorize("USER"),
  bookingsController.updateBooking
);

// Cancel booking
router.delete(
  "/user/:id",
  authenticate,
  authorize("USER"),
  bookingsController.cancelBooking
);

module.exports = router;