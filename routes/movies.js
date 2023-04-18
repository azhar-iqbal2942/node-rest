const express = require("express");
const router = express.Router();

const { Movies, validateMovie } = require("../models/movie");
const { Genres } = require("../models/genre");

router.get("/", async (req, res) => {
  const movies = await Movies.find().sort("title");
  res.send(movies);
});

router.post("/", async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) {
    const errorDetails = error.details.map((detail) => {
      return detail.message;
    });
    return res.status(400).send(errorDetails);
  }
  const genre = await Genres.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid Genre");

  let movie = new Movies({
    title: req.body.title,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
  });
  movie = await movie.save();
  res.send(movie);
});

router.put("/:id", async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) {
    const errorDetails = error.details.map((detail) => {
      return detail.message;
    });
    return res.status(400).send(errorDetails);
  }
  const genre = await Genres.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid Genre");

  const movie = await Movies.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
    },
    { new: true }
  );

  if (!movie) return res.status(404).send("Movie with Given ID not found");

  res.send(movie);
});

router.get("/:id", async (req, res) => {
  const movie = await Movies.findById(req.params.id);
  if (!movie) return res.status(404).send("Movie with Given ID not found");

  res.send(movie);
});

router.delete("/:id", async (req, res) => {
  const movie = await Movies.findByIdAndDelete(req.params.id);
  if (!movie) return res.status(404).send("Movie with Given ID not found");

  res.send(movie);
});

module.exports = router;
