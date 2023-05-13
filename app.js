require("dotenv").config(); // Load  ENV variables
const express = require("express");
const morgan = require("morgan");
const debug = require("debug")("app:startup");
const { Environment } = require("./core/enum");

const app = express();

const logger = require("./start/logging");
require("./start/routes")(app);
require("./start/db")();
require("./start/config")();
require("./start/validation")();
app.set("view engine", "pug");

if (app.get("env") === Environment.DEVELOPMENT) {
  app.use(morgan("tiny"));
  debug("Morgan Enabled...");
}

const port = process.env.PORT || 4500;
const server = app.listen(port, () => logger.info(`Listening on port ${port}`));

module.exports = server;
