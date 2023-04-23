/**
 * This function returns an asynchronous middleware function that catches errors thrown by the handler
 * function and passes them to the next middleware.
 * @param handler - a function that handles a specific route or endpoint in an Express application. It
 * takes in the request and response objects as parameters and returns a response to the client.
 * @returns The `asyncMiddleware` function returns an asynchronous function that takes in `req`, `res`,
 * and `next` as parameters and wraps around the `handler` function. The wrapped function catches any
 * errors thrown by the `handler` function and passes them to the `next` middleware function.
 */
function asyncMiddleware(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (ex) {
      next(ex);
    }
  };
}

module.exports = asyncMiddleware;
