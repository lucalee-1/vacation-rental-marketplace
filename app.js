const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const catchAsync = require("./helpers/catchAsync");
const ExpressError = require("./helpers/ExpressError");
const { rentalSchema } = require("./validationSchemas");
const methodOverride = require("method-override");
const Rental = require("./models/rental");

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

const validateRental = (req, res, next) => {
  const { error } = rentalSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

app.get("/", (req, res) => {
  res.render("home");
});

app.get(
  "/rentals",
  catchAsync(async (req, res) => {
    const rentals = await Rental.find({});
    res.render("rentals/allRentals", { rentals, title: "All Rentals" });
  })
);

app.post(
  "/rentals",
  validateRental,
  catchAsync(async (req, res) => {
    const rental = new Rental(req.body.rental);
    await rental.save();
    res.redirect(`/rentals/${rental._id}`);
  })
);

app.get("/rentals/new", (req, res) => {
  res.render("rentals/addNew", { title: "New Property" });
});

app.get(
  "/rentals/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const rental = await Rental.findById(id);
    res.render("rentals/details", {
      rental,
      title: `Vacation Rental: ${rental.title}`,
    });
  })
);

app.patch(
  "/rentals/:id",
  validateRental,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const rental = await Rental.findByIdAndUpdate(id, { ...req.body.rental });
    res.redirect(`/rentals/${rental._id}`);
  })
);

app.delete(
  "/rentals/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const rental = await Rental.findByIdAndDelete(id);
    res.redirect("/rentals");
  })
);

app.get(
  "/rentals/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const rental = await Rental.findById(id);
    res.render("rentals/edit", { rental, title: "Edit Property" });
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res
    .status(statusCode)
    .render("error", { statusCode, message, title: "Error" });
});

app.listen(3000, () => {
  console.log("Connected to port 3000");
});
