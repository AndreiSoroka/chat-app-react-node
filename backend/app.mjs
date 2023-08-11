import express from 'express';
import logger from 'morgan';

import indexRouter from './routes/index.mjs';
import { AllErrorsHandler, NotFoundHandler } from './errors.mjs';

const app = express();

const { NODE_ENV = 'development' } = process.env;

// view engine setup
app.use(logger(
  'combined',
  { skip: (req) => (NODE_ENV === 'production' ? req.originalUrl === '/api/ping' : false) },
));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// todo add ping
// app.get('/api/ping', ping);
app.use('/', indexRouter);

app.use(NotFoundHandler);
app.use(AllErrorsHandler);

// todo separate app and config
export default function App() {
  return app;
}
