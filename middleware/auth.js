const jwt = require("jsonwebtoken");
const config = require("config");

/**
 * The function checks for a valid authentication token in the request header and verifies it using a
 * private key, allowing access to the next middleware function if successful.
 * @param req - The `req` parameter is an object that represents the HTTP request made by the client to
 * the server. It contains information about the request such as the request method, headers, URL, and
 * body.
 * @param res - `res` stands for response. It is an object that represents the HTTP response that an
 * Express app sends when it receives an HTTP request. It contains methods for sending the response
 * back to the client, such as `status()` and `send()`. In the `auth` function, `res`
 * @param next - `next` is a function that is called to pass control to the next middleware function in
 * the stack. If an error occurs, `next` is called with an argument, and it will skip all remaining
 * middleware functions and go straight to the error handling middleware. If there are no more
 * middleware functions in
 * @returns The `auth` function is not returning anything. It is a middleware function that either
 * calls the `next()` function to pass control to the next middleware function in the stack, or sends a
 * response to the client with an error message and status code.
 */
function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token)
    return res
      .status(401)
      .send({ message: "Access denied. No token provided" });

  try {
    const decode = jwt.verify(token, config.get("jwt.privateKey"));
    req.user = decode;
    next();
  } catch (ex) {
    res.status(400).send({ message: "Invalid Token." });
  }
}

module.exports = auth;
