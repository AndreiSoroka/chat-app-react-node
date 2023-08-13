import express from 'express';
import logger from 'morgan';

import indexRouter from './routes/index.mjs';
import { AllErrorsHandler, NotFoundHandler } from './errors.mjs';
import { getWebSocketServer } from './bin/wss.mjs';

// todo path: /core/startServer
const app = express();

const { NODE_ENV = 'development' } = process.env;

// view engine setup
app.use(logger(
  'combined',
  { skip: (req) => (NODE_ENV === 'production' ? req.originalUrl === '/api/ping' : false) },
));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// todo: path: /models/messageModel.mjs
const messages = [];

// Fetch initial set of messages
// todo: path: /routes/messageRouter.mjs
app.get('/api/message/list', (req, res) => {
  // todo: path: /controllers/messageController.mjs
  res.json(messages.slice(-10));
});

// Add a new message
// todo: path: /routes/messageRouter.mjs
app.post('/api/message', (req, res) => {
  // todo: Add validation/guards for the request body. Maybe create a middleware for this.
  // todo: path: /controllers/messageController.mjs
  const message = {
    displayName: req.body.displayName,
    textContent: req.body.textContent,
    timestamp: new Date().toISOString(),
  };

  // add message to the list
  // todo: path: /models/messageModel.mjs
  messages.push(message);

  // todo: Consider moving WebSocket related operations to a separate utility or service.
  // todo: path: /lib/websocketService.mjs
  const wss = getWebSocketServer();
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify(message));
    }
  });

  res.status(201).json(message);
});

app.get('/', indexRouter);

app.use(NotFoundHandler);
app.use(AllErrorsHandler);

// todo separate app and config, path: /core/startServer
export default function App() {
  return app;
}
