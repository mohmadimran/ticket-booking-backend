const express = require("express");
const router = express.Router();

const showsController = require("../controller/showController");
const { authenticate, authorize } = require("../midellware/auth");

router.post(
  "/show",
  authenticate,
  authorize("ADMIN"),
  showsController.createShow
);

router.put(
  "/show/:id",
  authenticate,
  authorize("ADMIN"),
  showsController.updateShow
);

router.delete(
  "/show/:id",
  authenticate,
  authorize("ADMIN"),
  showsController.deleteShow
);

router.get("/shows", showsController.listShows);

router.get("/show/:id", showsController.getShow);

module.exports = router;