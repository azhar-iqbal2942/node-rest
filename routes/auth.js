const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");

const { User } = require("../models/user");
const router = express.Router();

router.post("/login", async (req, res) => {
  // validate user input data
  const { error } = validate(req);
  if (error) {
    const errorDetails = error.details.map((detail) => {
      return detail.message;
    });
    return res.status(400).send(errorDetails);
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) return res.status(400).send("Invalid email or password");

  res.send(true);
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  return schema.validate(req.body);
}

module.exports = router;
