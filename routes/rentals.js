const { Rental, validate } = require("../models/rental");
const { Movies } = require("../models/movie");
const { Customers } = require("../models/customer");

const express = require("express");
// const Fawn = require("fawn");
const router = express.Router();

// Fawn.init("mongodb://0.0.0.0:27017/vidly");

router.get("/", async (req, res, next) => {
  try {
    const rentals = await Rental.find().sort("-dateOut");
    res.send(rentals);
  } catch (ex) {
    next(ex);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customers.findById(req.body.customerId);
    if (!customer) return res.status(400).send("Invalid customer.");

    const movie = await Movies.findById(req.body.movieId);
    if (!movie) return res.status(400).send("Invalid movie.");

    if (movie.numberInStock === 0)
      return res.status(400).send("Movie not in stock.");

    let rental = new Rental({
      customer: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate,
      },
    });
    rental = await rental.save();

    try {
      // TODO: need to implement two phase commit
      //TODO: There is an error in update need to fix later in this package.
      // new Fawn.Task()
      //   .save("rentals", rental)
      //   // .update(
      //   //   "movies",
      //   //   { _id: movie._id },
      //   //   {
      //   //     $inc: { numberInStock: -1 },
      //   //   }
      //   // )
      //   .run();
      res.send(rental);
    } catch (ex) {
      res.status(500).send("Something failed");
    }
  } catch (ex) {
    next(ex);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const rental = await Rental.findById(req.params.id);

    if (!rental)
      return res
        .status(404)
        .send("The rental with the given ID was not found.");

    res.send(rental);
  } catch (ex) {
    next(ex);
  }
});

module.exports = router;
