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

// Confirm booking
// router.post(
//   "/admin/confirm/:id",
//   authenticate,
//   authorize("ADMIN"),
//   bookingsController.confirmBooking
// );

// cancle booking

// router.post(
//   "/admin/cancel/:id",
//   authenticate,
//   authorize("ADMIN"),
//   bookingsController.failBooking
// );
// router.delete(
//   "/admin/delete/:id",
//   authenticate,
//   authorize("ADMIN"),
//   bookingsController.cancelBooking
// );

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

// My bookings
router.get(
  "/user/my-bookings",
  authenticate,
  authorize("USER"),
  bookingsController.getMyBookings
);

// Booking details
// router.get(
//   "/user/detail/:id",
//   authenticate,
//   authorize("USER"),
//   bookingsController.getBooking
// );

// Update booking
// router.put(
//   "/user/update/:id",
//   authenticate,
//   authorize("USER"),
//   bookingsController.updateBooking
// );

// Cancel booking
// router.delete(
//   "/user/delete:id",
//   authenticate,
//   authorize("USER"),
//   bookingsController.cancelBooking
// );

router.put(
  "/user/cancel/:id",
  authenticate,
  authorize("USER"),
  bookingsController.cancelBooking
);

router.put(
  "/user/update/status/:id",
  authenticate,
  authorize("USER"),
  bookingsController.updateBooking
);

module.exports = router;