const bookingsService = require('../servicess/bookingServices');
const config = require('../config');

let timer = null;

function startExpiryWorker() {
  const intervalMs = config.expiryWorkerIntervalMs;
  const expirySeconds = Math.round(config.bookingExpiryMs / 1000);

  timer = setInterval(async () => {
    try {
      await bookingsService.findAndFailExpiredBookings(expirySeconds);
    } catch (err) {
      console.error('Expiry worker error', err);
    }
  }, intervalMs);

  console.log(`Expiry worker started: failing PENDING bookings older than ${expirySeconds} seconds every ${intervalMs}ms`);
}

function stopExpiryWorker() {
  if (timer) clearInterval(timer);
}

module.exports = { startExpiryWorker, stopExpiryWorker };
