// migrate to MVC
import errors from './errors.json' assert {type: 'json'};
import getEnvironments from '../env/getEnvironments.mjs';

const { NODE_ENV } = getEnvironments();

export function NotFoundHandler(req, res, next) {
  next(errors.default.NOT_FOUND);
}

/**
 * AllErrorsHandler handle each error on project
 */
export function AllErrorsHandler(err, req, res, next) {
  const error = (err?.status && err?.errorMessage && err?.errorCode)
    ? err
    : errors.default.DEFAULT_ERROR;

  if (NODE_ENV !== 'test') {
    console.error(req.originalUrl, error);
    if (typeof error !== 'object') {
      console.error(new Error().stack);
    }
  }

  // render the error page
  res.status(error.status || 500);
  res.send({ ...error, success: false });
  next();
}
