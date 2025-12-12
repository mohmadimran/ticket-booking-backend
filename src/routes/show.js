const express = require('express');
const router = express.Router();
const showsController = require('../controller/showController');

router.post('/', showsController.createShow);
router.get('/', showsController.listShows);
router.get('/:id', showsController.getShow);

module.exports = router;
