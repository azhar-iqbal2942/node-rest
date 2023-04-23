const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    // TODO: Add email regex validator
  },
  password: {
    type: String,
    required: true,
    // if this flag enabled this property not available in db query in response
    // select: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwt.privateKey")
  );
};
const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
