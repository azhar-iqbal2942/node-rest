const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");

const { User, validate } = require("../models/user");
const router = express.Router();

router.post("/register", async (req, res) => {
  // validate user input data
  const { error } = validate(req.body);
  if (error) {
    const errorDetails = error.details.map((detail) => {
      return detail.message;
    });
    return res.status(400).send(errorDetails);
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User with this email already exists");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  // TODO: handle exception cases
  user = await user.save();
  const token = user.generateAuthToken();

  user = _.pick(user, ["_id", "name", "email"]);
  res.header("x-auth-token", token).send(user);
});

module.exports = router;
