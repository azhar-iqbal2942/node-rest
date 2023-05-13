const express = require("express");
const helmet = require("helmet");

const home_routes = require("../routes/home");
const genre_routes = require("../routes/genres");
const customer_routes = require("../routes/customers");
const movie_routes = require("../routes/movies");
const rental_routes = require("../routes/rentals");
const user_routes = require("../routes/users");
const auth_routes = require("../routes/auth");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use(express.static("public"));
  app.use(helmet());

  // local routes
  app.use("/api/movies", movie_routes);
  app.use("/api/genres", genre_routes);
  app.use("/api/customers", customer_routes);
  app.use("/api/rentals", rental_routes);
  app.use("/api/users", user_routes);
  app.use("/api/auth/", auth_routes);
  app.use("/", home_routes);

  // Error Middleware
  app.use(error);
};
