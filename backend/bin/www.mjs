#!/usr/bin/env node

import http from 'http';
import semver from 'semver';
import App from '../app.mjs';
import packageJson from '../package.json' assert {type: 'json'};
import { initWebSocket } from './wss.mjs';

if (!semver.satisfies(process.version, packageJson.engines.node)) {
  console.error(
    `Required node version ${packageJson.engines.node} not satisfied with current version ${process.version}.`,
  );
  process.exit(1);
}

/**
 * Normalize a port into a number or undefined.
 * @param {string|number} value
 * @returns {number}
 */
function normalizePort(value) {
  const port = parseInt(value, 10);

  if (!port || port.toString() !== value.toString()) {
    console.error(`Bad port ${value}`);
    process.exit(1);
  }
  return port;
}

const START_LABEL = 'stared';
const HOST = process.env.HOST || '127.0.0.1';
const PORT = normalizePort(process.env.PORT || '3000');

console.time(START_LABEL);

/**
 * Event listener for HTTP server "error" event.
 * @param error
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${PORT} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${PORT} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

(async () => {
  if (!PORT) {
    console.error('env PORT is required');
    process.exit(1);
  }

  const app = await App();
  app.set('port', PORT);

  /**
   * Create HTTP server.
   */
  const server = http.createServer(app);
  initWebSocket(server);

  /**
   * Listen on provided port, on all network interfaces.
   */
  server.listen(PORT, HOST, () => {
    console.log(`server listen ${HOST}:${PORT}`);
    console.timeEnd(START_LABEL);
  });
  server.on('error', onError);
})();
