const express = require("express");
const router = express.Router();
const catchAsync = require("../helpers/catchAsync");
const ExpressError = require("../helpers/ExpressError");
const Rental = require("../models/rental");
const { rentalSchema } = require("../validationSchemas");


const validateRental = (req, res, next) => {
  const { error } = rentalSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

router.get(
  "/",
  catchAsync(async (req, res) => {
    const rentals = await Rental.find({});
    res.render("rentals/allRentals", { rentals, title: "All Rentals" });
  })
);

router.post(
  "/",
  validateRental,
  catchAsync(async (req, res) => {
    const rental = new Rental(req.body.rental);
    await rental.save();
    res.redirect(`/rentals/${rental._id}`);
  })
);

router.get("/new", (req, res) => {
  res.render("rentals/addNew", { title: "New Property" });
});

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const rental = await Rental.findById(id).populate("reviews");
    res.render("rentals/details", {
      rental,
      title: `Vacation Rental: ${rental.title}`,
    });
  })
);

router.patch(
  "/:id",
  validateRental,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const rental = await Rental.findByIdAndUpdate(id, { ...req.body.rental });
    res.redirect(`/rentals/${rental._id}`);
  })
);

router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const rental = await Rental.findByIdAndDelete(id);
    res.redirect("/rentals");
  })
);

router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const rental = await Rental.findById(id);
    res.render("rentals/edit", { rental, title: "Edit Property" });
  })
);

module.exports = router;
