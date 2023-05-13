const express = require("express");
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const admin = require("../middleware/admin");
const asyncMiddleware = require("../middleware/async");
const router = express.Router();

const { validateGenre } = require("../utils");
const { Genres } = require("../models/genre");

router.get(
  "/",
  asyncMiddleware(async (req, res, next) => {
    const genres = await Genres.find().sort("name");
    res.send(genres);
  })
);

router.post("/", auth, async (req, res, next) => {
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
    next(exception);
  }
});

router.put("/:id", auth, async (req, res, next) => {
  try {
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
  } catch (ex) {
    next(ex);
  }
});

router.get("/:id", validateObjectId, async (req, res, next) => {
  try {
    const genre = await Genres.findById(req.params.id);
    if (!genre)
      return res.status(404).send("The genre with the given ID was not found.");
    res.send(genre);
  } catch (ex) {
    next(ex);
  }
});

router.delete("/:id", [auth, admin], async (req, res, next) => {
  try {
    const genre = await Genres.findByIdAndDelete(req.params.id);
    if (!genre)
      return res.status(404).send("The genre with the given ID was not found.");

    res.send(genre);
  } catch (ex) {
    next(ex);
  }
});

module.exports = router;
