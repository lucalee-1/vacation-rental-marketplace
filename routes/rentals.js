const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
const catchAsync = require("../helpers/catchAsync");
const rentals = require("../controllers/rentals");
const { isLoggedIn, isOwner, validateRental } = require("../middleware");

router
  .route("/")
  .get(catchAsync(rentals.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateRental,
    catchAsync(rentals.addNewRental)
  );

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
