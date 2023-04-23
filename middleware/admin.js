/**
 * The function checks if the user is an admin and returns an error message if not.
 * @param req - The `req` parameter is an object that represents the HTTP request made by the client to
 * the server. It contains information about the request such as the request method, headers, URL, and
 * any data sent in the request body.
 * @param res - `res` stands for response. It is an object that represents the HTTP response that an
 * Express app sends when it receives an HTTP request. The `res` object contains methods for sending
 * the response back to the client, such as `res.send()`, `res.json()`, `res.status()
 * @param next - `next` is a function that is called to pass control to the next middleware function in
 * the stack. It is typically called at the end of the current middleware function to indicate that it
 * has completed its task and the next middleware function can take over. If there are no more
 * middleware functions in the stack
 * @returns If the user making the request is not an admin, a response with a status code of 403 and a
 * message "Access denied" will be sent. If the user is an admin, the function will call the next
 * middleware function.
 */
function admin(req, res, next) {
  if (!req.user.isAdmin)
    return res.status(403).send({ message: "Access denied" });

  next();
}

module.exports = admin;
