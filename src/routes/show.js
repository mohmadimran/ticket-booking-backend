const express = require('express');
const router = express.Router();
const showsController = require('../controller/showController');
const { authenticate, authorize } = require('../midellware/auth');

// ADMIN only → create show
router.post(
  '/show/',
  authenticate,
  authorize('ADMIN'),
  showsController.createShow
);

// Public → list shows
router.get('/shows/', showsController.listShows);

// Public → get single show
router.get('/show/:id', showsController.getShow);

module.exports = router;
