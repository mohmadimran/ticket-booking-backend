const express = require('express');
const router = express.Router();
const showRoutes = require('./show'); 
const bookingRoutes = require('./booking'); 
const authRoutes = require("./auth")
router.use('/auth', authRoutes);
router.use('/shows', showRoutes);
router.use('/bookings', bookingRoutes);

module.exports = router;
