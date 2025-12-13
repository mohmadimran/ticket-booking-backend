// const express = require('express');
// const router = express.Router();
// const showsController = require('../controller/showController');

// router.post('/', showsController.createShow);
// router.get('/', showsController.listShows);
// router.get('/:id', showsController.getShow);

// module.exports = router;

const express = require('express');
const router = express.Router();
const showsController = require('../controller/showController');
const { authenticate, authorize } = require('../midellware/auth');

// ADMIN only → create show
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  showsController.createShow
);

// Public → list shows
router.get('/', showsController.listShows);

// Public → get single show
router.get('/:id', showsController.getShow);

module.exports = router;
