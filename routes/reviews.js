const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../helpers/catchAsync");
const reviews = require("../controllers/reviews");
const { validateReview, isLoggedIn, isReviewOwner } = require("../middleware");

const Rental = require("../models/rental");
const Review = require("../models/review");

router.get("/", reviews.redirectToRentalDetails);

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.addNewReview));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewOwner,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
