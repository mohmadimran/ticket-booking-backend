const express = require('express');
const router = express.Router();

const authRoutes = require("./auth")
const showRoutes = require('./show'); 
const bookingRoutes = require('./booking'); 

//  all routes

router.use('/auth', authRoutes);
router.use('/shows', showRoutes);
router.use('/bookings', bookingRoutes);

// Handle 404 for routes that don't exist 

// router.use('*', (req, res) => {
//   res.status(404).json({ 
//     message: 'Route not found',
//     requestedUrl: req.originalUrl 
//   });
// });
module.exports = router;
