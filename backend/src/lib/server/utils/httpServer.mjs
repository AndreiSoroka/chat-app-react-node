import http from "http";
import getEnvironments from "../../env/getEnvironments.mjs";
/**
 * @typedef {import('http').Server} HTTPServer
 */

const { PORT } = getEnvironments();
let server;

/**
 * Event listener for HTTP server "error" event.
 * @param {Error} error
 */
function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  // friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(`${PORT} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`${PORT} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Create HTTP server
 * @param {Express} app
 * @returns {HTTPServer}
 */
export function initHttpServer(app) {
  if (server) {
    throw new Error("HTTP server already created");
  }
  server = http.createServer(app);

  server.on("error", onError);
  return server;
}

// todo: not used at the moment, but I just want to keep it here
/**
 * Get HTTP server
 * @returns {HTTPServer}
 */
// export function getHttpServer() {
//   if (!server) {
//     throw new Error('HTTP server not created');
//   }
//   return server;
// }
