const Rental = require("../models/rental");
const Review = require("../models/review");

module.exports.redirectToRentalDetails = (req, res) => {
  res.redirect(`/rentals/${req.params.id}`);
};

module.exports.addNewReview = async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  const review = new Review(req.body.review);
  review.owner = req.user._id;
  rental.reviews.push(review);
  await review.save();
  await rental.save();
  req.flash("success", "New review added!");
  res.redirect(`/rentals/${rental._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Rental.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted!");
  res.redirect(`/rentals/${id}`);
};
