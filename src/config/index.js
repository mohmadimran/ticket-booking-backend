require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3001,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/ticketdb',
  bookingExpiryMs: process.env.BOOKING_EXPIRY_MS ? parseInt(process.env.BOOKING_EXPIRY_MS, 10) : 120000,
  expiryWorkerIntervalMs: process.env.EXPIRY_WORKER_INTERVAL_MS ? parseInt(process.env.EXPIRY_WORKER_INTERVAL_MS, 10) : 30000
};
