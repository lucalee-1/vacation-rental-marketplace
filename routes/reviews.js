const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../helpers/catchAsync");
const { validateReview, isLoggedIn, isReviewOwner } = require("../middleware");
const Rental = require("../models/rental");
const Review = require("../models/review");

router.get("/", (req, res) => {
  res.redirect(`/rentals/${req.params.id}`);
});
router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(async (req, res) => {
    const rental = await Rental.findById(req.params.id);
    const review = new Review(req.body.review);
    review.owner = req.user._id;
    rental.reviews.push(review);
    await review.save();
    await rental.save();
    req.flash("success", "New review added!");
    res.redirect(`/rentals/${rental._id}`);
  })
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewOwner,
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Rental.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted!");
    res.redirect(`/rentals/${id}`);
  })
);

module.exports = router;
