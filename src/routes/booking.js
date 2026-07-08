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
  "/admin/all-bookings",
  authenticate,
  authorize("ADMIN"),
  bookingsController.listBookings
);

router.put(
  "/admin/confirm/:id",
  authenticate,
  authorize("ADMIN"),
  bookingsController.confirmBooking
);

router.put(
  "/admin/reject/:id",
  authenticate,
  authorize("ADMIN"),
  bookingsController.rejectBooking
);


/* ===========================
   USER ROUTES
=========================== */

// Create booking
router.post(
  "/user/create/:showId",
  authenticate,
  authorize("USER"),
  bookingsController.createBooking
);

//get  My all bookings
router.get(
  "/user/my-bookings",
  authenticate,
  authorize("USER"),
  bookingsController.getMyBookings
);


// Update booking
router.put(
  "/user/update/:id",
  authenticate,
  authorize("USER"),
  bookingsController.updateBooking
);

// cancel booking
router.put(
  "/user/cancel/:id",
  authenticate,
  authorize("USER"),
  bookingsController.cancelBooking
);

module.exports = router;