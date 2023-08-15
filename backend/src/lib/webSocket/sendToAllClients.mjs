import { getWebSocketServer } from "../server/index.mjs";

/**
 * Send a some data to all connected clients
 * @param {Object} data
 */
export default function sendToAllClients(data) {
  const wss = getWebSocketServer();

  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}
