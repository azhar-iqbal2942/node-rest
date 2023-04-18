const mongoose = require("mongoose");
const { genreSchema } = require("./genre");
const Joi = require("joi");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  numberInStock: {
    type: Number,
    min: 0,
    default: 0,
  },
  dailyRentalRate: {
    type: Number,
    default: 0,
    min: 0,
  },
  genre: {
    type: genreSchema,
    required: true,
  },
});

const Movies = mongoose.model("Movie", movieSchema);

function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(50).required(),
    numberInStock: Joi.number(),
    dailyRentalRate: Joi.number(),
    genreId: Joi.string().required(),
  });
  return schema.validate(movie);
}

exports.Movies = Movies;
exports.movieSchema = movieSchema;
exports.validateMovie = validateMovie;
