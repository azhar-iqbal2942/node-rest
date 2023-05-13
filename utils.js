const Joi = require("joi");

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  return schema.validate(course);
}

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(5).required(),
  });
  return schema.validate(genre);
}

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    phone: Joi.string().required(),
    isGold: Joi.boolean(),
  });
  return schema.validate(customer);
}

exports.validateCourse = validateCourse;
exports.validateGenre = validateGenre;
exports.validateCustomer = validateCustomer;
