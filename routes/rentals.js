const express = require("express");
const router = express.Router();
const catchAsync = require("../helpers/catchAsync");
const ExpressError = require("../helpers/ExpressError");
const Rental = require("../models/rental");
const { rentalSchema } = require("../validationSchemas.js");

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
    req.flash("success", "New vacation rental added!");
    res.redirect(`/rentals/${rental._id}`);
  })
);

router.get("/new", (req, res) => {
  res.render("rentals/addNew", { title: "New Property" });
});

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const rental = await Rental.findById(req.params.id).populate("reviews");
    if (!rental) {
        req.flash("error", "Vacation rental not found")
        return res.redirect("/rentals")
    }
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
    req.flash("success", "Vacation rental updated!");
    res.redirect(`/rentals/${rental._id}`);
  })
);

router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const rental = await Rental.findByIdAndDelete(id);
    req.flash("success", "Vacation rental deleted!");

    res.redirect("/rentals");
  })
);

router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const rental = await Rental.findById(id);
    if (!rental) {
        req.flash("error", "Vacation rental not found")
        return res.redirect("/rentals")
    }
    res.render("rentals/edit", { rental, title: "Edit Property" });
  })
);

module.exports = router;
