const logger = require("../core/logger");

/**
 * This function handles errors by logging them and sending a 500 status code with a message.
 * @param err - The error object that was thrown or passed to the next() function.
 * @param req - req stands for "request" and it is an object that represents the HTTP request made by
 * the client to the server. It contains information such as the URL, HTTP method, headers, and any
 * data sent in the request body.
 * @param res - `res` stands for response. It is an object that represents the HTTP response that an
 * Express app sends when it receives an HTTP request. It contains methods for setting the HTTP status
 * code, headers, and body of the response. In the given code snippet, `res.status(500)` sets the
 * @param next - `next` is a function that is called to pass control to the next middleware function in
 * the chain. It is typically used to handle errors or to move on to the next middleware function in
 * the stack.
 */
function error(err, req, res, next) {
  logger.warn(err);

  res.status(500).send({ message: "Something went wrong" });
}
module.exports = error;
