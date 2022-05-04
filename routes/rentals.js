const express = require("express");
const router = express.Router();
const catchAsync = require("../helpers/catchAsync");
const rentals = require("../controllers/rentals");
const { isLoggedIn, isOwner, validateRental } = require("../middleware");
const Rental = require("../models/rental");

router
  .route("/")
  .get(catchAsync(rentals.index))
  .post(isLoggedIn, catchAsync(rentals.addNewRental));

router.get("/new", isLoggedIn, rentals.renderAddNewForm);

router
  .route("/:id")
  .get(catchAsync(rentals.showRentalDetails))
  .patch(isLoggedIn, validateRental, catchAsync(rentals.editRental))
  .delete(isLoggedIn, isOwner, catchAsync(rentals.deleteRental));

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  catchAsync(rentals.renderEditForm)
);

module.exports = router;
