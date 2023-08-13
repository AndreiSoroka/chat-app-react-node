import {
  initExpress,
  initHttpServer,
  initWebSocket,
  checkNodeVersion,
  checkPort,
  normalizePort,
} from '../lib/server/index.mjs';
import getEnvironments from '../lib/env/getEnvironments.mjs';

const START_LABEL = 'stared';
console.time(START_LABEL);

const { PORT, HOST } = getEnvironments();

export default function startServer() {
  checkNodeVersion();
  checkPort();

  const port = normalizePort(PORT);

  const app = initExpress();
  const server = initHttpServer(app);
  const wss = initWebSocket(server);

  /**
   * Listen on provided port, on all network interfaces.
   */
  function listen() {
    server.listen(port, HOST, () => {
      console.log(`server listen http://${HOST}:${PORT}`);
      console.timeEnd(START_LABEL);
    });
  }

  return {
    app,
    server,
    wss,
    listen,
  };
}
