const express = require("express");
const router = express.Router();
const catchAsync = require("../helpers/catchAsync");
const rentals = require("../controllers/rentals");
const { isLoggedIn, isOwner, validateRental } = require("../middleware");
const Rental = require("../models/rental");

router.get("/", catchAsync(rentals.index));

router.get("/new", isLoggedIn, rentals.renderAddNewForm);

router.post("/", isLoggedIn, catchAsync(rentals.addNewRental));

router.get("/:id", catchAsync(rentals.showRentalDetails));

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  catchAsync(rentals.renderEditForm)
);

router.patch(
  "/:id",
  isLoggedIn,
  validateRental,
  catchAsync(rentals.editRental)
);

router.delete("/:id", isLoggedIn, isOwner, catchAsync(rentals.deleteRental));

module.exports = router;
