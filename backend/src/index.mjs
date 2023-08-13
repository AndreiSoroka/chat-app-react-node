import startServer from './core/startServer.mjs';
import messageRouter from './routes/messageRouter.mjs';
import pingRouter from './routes/pingRouter.mjs';
import { AllErrorsHandler, NotFoundHandler } from './lib/errors/errors.mjs';

const { app, listen } = startServer();

app.use('/api', messageRouter);
app.use('/api', pingRouter);

app.use(NotFoundHandler);
app.use(AllErrorsHandler);

listen();
