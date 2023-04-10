// Load  ENV variables
require("dotenv").config();
// Third party
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const debug = require("debug")("app:startup");
// Local
const logger = require("./middleware/logger");
const authentication = require("./middleware/authentication");

const { Environment } = require("./core/enum");
const courses_route = require("./routes/courses");
const home_route = require("./routes/home");

const app = express();
app.set("view engine", "pug");

/**
 * ***********
 * Middlewares
 * ***********
 */
// default
app.use(express.json());
app.use(express.static("public"));
app.use(helmet());
// Router
app.use("/api/courses", courses_route);
app.use("/", home_route);

// Custom
app.use(logger);
app.use(authentication);

if (app.get("env") === Environment.DEVELOPMENT) {
  app.use(morgan("tiny"));
  debug("Morgan Enabled...");
}

const port = process.env.PORT || 4500;
app.listen(port, () => console.log(`Listening on port ${port}`));
