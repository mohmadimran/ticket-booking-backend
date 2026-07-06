const express = require("express");
const router = express.Router();

const showsController = require("../controller/showController");
const { authenticate, authorize } = require("../midellware/auth");

router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  showsController.createShow
);

router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  showsController.updateShow
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  showsController.deleteShow
);

router.get("/", showsController.listShows);

router.get("/:id", showsController.getShow);

module.exports = router;