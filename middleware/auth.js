const jwt = require("jsonwebtoken");
const config = require("config");

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
