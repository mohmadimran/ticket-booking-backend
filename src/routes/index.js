const express = require('express');
const router = express.Router();
const showsRouter = require('./show'); 
// const bookingsRouter = require('./booking'); 


router.use('/shows', showsRouter);
router.use('/bookings',  require('./booking'));

module.exports = router;
