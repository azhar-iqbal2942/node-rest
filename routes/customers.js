const express = require("express");
const router = express.Router();
const { validateCustomer } = require("../utils");
const { Customers } = require("../models/customer");

router.get("/", async (req, res) => {
  const customers = await Customers.find().sort("name");
  res.send(customers);
});

router.post("/", async (req, res) => {
  // Validate user input data
  const { error } = validateCustomer(req.body);
  if (error) {
    const errorDetails = error.details.map((detail) => {
      return detail.message;
    });
    return res.status(400).send(errorDetails);
  }

  let customer = new Customers({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });
  try {
    customer = await customer.save();
    res.send(genre);
  } catch (exception) {
    // TODO: return exception errors
    res.send(customer);
  }
});

router.put("/:id", async (req, res) => {
  // Validate input data.
  const { error } = validateCustomer(req.body);
  if (error) {
    const errorDetails = error.details.map((detail) => {
      return detail.message;
    });
    return res.status(400).send(errorDetails);
  }

  // update
  const customer = await Customers.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      phone: req.body.phone,
      isGold: req.body.isGold,
    },
    { new: true }
  );

  if (!customer)
    return res
      .status(404)
      .send("The customer with the given ID was not found.");

  res.send(customer);
});

router.get("/:id", async (req, res) => {
  const customer = await Customers.findById(req.params.id);
  if (!customer)
    return res
      .status(404)
      .send("The customer with the given ID was not found.");
  res.send(customer);
});

router.delete("/:id", async (req, res) => {
  const customer = await Customers.findByIdAndDelete(req.params.id);
  if (!customer)
    return res
      .status(404)
      .send("The customer with the given ID was not found.");

  res.send(customer);
});

module.exports = router;
