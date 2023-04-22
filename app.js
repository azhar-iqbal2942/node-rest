// Load  ENV variables
require("dotenv").config();
// Third party
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const debug = require("debug")("app:startup");
const mongoose = require("mongoose");
const Joi = require("joi");

// Local
const logger = require("./middleware/logger");
const authentication = require("./middleware/authentication");

const { Environment } = require("./core/enum");
// Routes
const home_routes = require("./routes/home");
const genre_routes = require("./routes/genres");
const customer_routes = require("./routes/customers");
const movie_routes = require("./routes/movies");
const rental_routes = require("./routes/rentals");
const user_routes = require("./routes/users");
const auth_routes = require("./routes/auth");

const app = express();
app.set("view engine", "pug");

Joi.objectId = require("joi-objectid")(Joi);
mongoose
  .connect("mongodb://0.0.0.0:27017/vidly")
  .then(() => console.log("Connected to database successfully"))
  .catch((err) => console.error("Error while connecting to db.", err.message));

/**
 * ***********
 * Middlewares
 * ***********
 */
// default
app.use(express.json());
app.use(express.static("public"));
app.use(helmet());

// Register Router
app.use("/api/movies", movie_routes);
app.use("/api/genres", genre_routes);
app.use("/api/customers", customer_routes);
app.use("/api/rentals", rental_routes);
app.use("/api/users", user_routes);
app.use("/api/auth/", auth_routes);
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
