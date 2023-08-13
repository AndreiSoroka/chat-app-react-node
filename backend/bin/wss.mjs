// todo it is temp file
import { WebSocketServer } from 'ws';
import { parse } from 'url';

let wss = null;

export function initWebSocket(server) {
  wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', function upgrade(request, socket, head) {
    if (request.url === '/api/socket') {
      wss.handleUpgrade(request, socket, head, function done(ws) {
        wss.emit('connection', ws, request);
      });
    } else {
      socket.destroy();
    }
  });
}

export function getWebSocketServer() {
  return wss;
}
