const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const { validateGenre } = require("../utils");

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
});
const Genres = mongoose.model("Genre", genreSchema);

router.get("/", async (req, res) => {
  const genres = await Genres.find().sort("name");
  res.send(genres);
});

router.post("/", async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) {
    const errorDetails = error.details.map((detail) => {
      return detail.message;
    });
    return res.status(400).send(errorDetails);
  }

  let genre = new Genres({ name: req.body.name });
  try {
    genre = await genre.save();
    res.send(genre);
  } catch (exception) {
    // TODO: return exception errors
    res.send(genre);
  }
});

router.put("/:id", async (req, res) => {
  // Validate input data.
  const { error } = validateGenre(req.body);
  if (error) {
    const errorDetails = error.details.map((detail) => {
      return detail.message;
    });
    return res.status(400).send(errorDetails);
  }

  // update
  const genre = await Genres.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    { new: true }
  );

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(genre);
});

router.get("/:id", async (req, res) => {
  const genre = await Genres.findById(req.params.id);
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");
  res.send(genre);
});

router.delete("/:id", async (req, res) => {
  const genre = await Genres.findByIdAndDelete(req.params.id);
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(genre);
});

module.exports = router;
