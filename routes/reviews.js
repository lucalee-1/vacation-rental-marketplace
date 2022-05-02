const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../helpers/catchAsync");
const ExpressError = require("../helpers/ExpressError");
const Rental = require("../models/rental");
const Review = require("../models/review");
const { reviewSchema } = require("../validationSchemas");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const rental = await Rental.findById(req.params.id);
    const review = new Review(req.body.review);
    rental.reviews.push(review);
    await review.save();
    await rental.save();
    req.flash("success", "New review added!");
    res.redirect(`/rentals/${rental._id}`);
  })
);

router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Rental.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted!");
    res.redirect(`/rentals/${id}`);
  })
);

module.exports = router;
