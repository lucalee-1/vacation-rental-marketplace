const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const catchAsync = require("./helpers/catchAsync");
const ExpressError = require("./helpers/ExpressError");
const { rentalSchema, reviewSchema } = require("./validationSchemas");
const methodOverride = require("method-override");
const Rental = require("./models/rental");
const Review = require("./models/review");

const rentals = require("./routes/rentals")

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

mongoose.connect("mongodb://localhost:27017/vacation-rental"),
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  };

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error"));
db.once("open", () => {
  console.log("Database connected");
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));



const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

app.use("/rentals", rentals)

app.get("/", (req, res) => {
  res.render("home");
});

app.post(
  "/rentals/:id/reviews",
  validateReview,
  catchAsync(async (req, res) => {
    const rental = await Rental.findById(req.params.id);
    const review = new Review(req.body.review);
    rental.reviews.push(review);
    await review.save();
    await rental.save();
    res.redirect(`/rentals/${rental._id}`);
  })
);

app.delete(
  "/rentals/:id/reviews/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Rental.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/rentals/${id}`);
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res
    .status(statusCode)
    .render("error", { err, title: "Error" });
});

app.listen(3000, () => {
  console.log("Connected to port 3000");
});
