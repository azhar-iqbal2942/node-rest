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
const course_routes = require("./routes/courses");
const home_routes = require("./routes/home");
const genre_routes = require("./routes/genres");

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
app.use("/api/courses", course_routes);
app.use("/api/genre", genre_routes);
app.use("/", home_routes);

// Custom
app.use(logger);
app.use(authentication);

if (app.get("env") === Environment.DEVELOPMENT) {
  app.use(morgan("tiny"));
  debug("Morgan Enabled...");
}

const port = process.env.PORT || 4500;
app.listen(port, () => console.log(`Listening on port ${port}`));
