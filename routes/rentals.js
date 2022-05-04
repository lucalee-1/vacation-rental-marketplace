const express = require("express");
const router = express.Router();
const catchAsync = require("../helpers/catchAsync");
const { isLoggedIn, isOwner, validateRental } = require("../middleware");
const Rental = require("../models/rental");

router.get(
  "/",
  catchAsync(async (req, res) => {
    const rentals = await Rental.find({});
    res.render("rentals/allRentals", { rentals, title: "All Rentals" });
  })
);

router.post(
  "/",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const rental = new Rental(req.body.rental);
    rental.owner = req.user._id;
    await rental.save();
    req.flash("success", "New vacation rental added!");
    res.redirect(`/rentals/${rental._id}`);
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("rentals/addNew", { title: "New Property" });
});

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const rental = await Rental.findById(req.params.id)
      .populate({ path: "reviews", populate: { path: "owner" } })
      .populate("owner");
    if (!rental) {
      req.flash("error", "Vacation rental not found");
      return res.redirect("/rentals");
    }
    res.render("rentals/details", {
      rental,
      title: `Vacation Rental: ${rental.title}`,
    });
  })
);

router.patch(
  "/:id",
  isLoggedIn,
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
  isLoggedIn,
  isOwner,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const rental = await Rental.findByIdAndDelete(id);
    req.flash("success", "Vacation rental deleted!");

    res.redirect("/rentals");
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const rental = await Rental.findById(id);
    if (!rental) {
      req.flash("error", "Vacation rental not found");
      return res.redirect("/rentals");
    }
    res.render("rentals/edit", { rental, title: "Edit Property" });
  })
);

module.exports = router;
