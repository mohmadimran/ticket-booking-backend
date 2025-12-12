const app = require('./src/app');
const config = require('./src/config');
const { connect } = require('./src/db');
const { startExpiryWorker } = require('./src/workers/expiaryWorker');

const port = config.port;

async function start() {
  await connect();
  const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    startExpiryWorker();
  });

  process.on('SIGINT', () => {
    console.log('Shutting down...');
    server.close(() => process.exit(0));
  });
}

start().catch(err => {
  console.error('Failed to start', err);
  process.exit(1);
});
