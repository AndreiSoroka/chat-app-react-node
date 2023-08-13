import { WebSocketServer } from 'ws';

/**
 * @typedef {import('ws').WebSocketServer} WebSocketServerInstance
 */

let wss;

/**
 * Create WebSocket listener
 * @param {HTTPServer} server
 * @returns {WebSocketServerInstance}
 */
export function initWebSocket(server) {
  wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    if (request.url === '/api/socket') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    } else {
      socket.destroy();
    }
  });

  return wss;
}

/**
 * Get WebSocket
 * @returns {WebSocketServerInstance}
 */
export function getWebSocketServer() {
  if (!wss) {
    throw new Error('WebSocket server not created');
  }
  return wss;
}
