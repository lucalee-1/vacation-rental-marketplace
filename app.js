if(process.env.NODE_ENV !=="production") {
  require('dotenv').config()
}

const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("passport-local");
const ExpressError = require("./helpers/ExpressError");
const methodOverride = require("method-override");

const User = require("./models/user");

const rentalRoutes = require("./routes/rentals");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");

mongoose.connect("mongodb://localhost:27017/vacation-rental");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
  secret: "temporarysecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.title = "Vacation Rental Marketplace";
  next();
});

app.use("/", userRoutes);
app.use("/rentals", rentalRoutes);
app.use("/rentals/:id/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error", { err, title: "Error" });
});

app.listen(8000, () => {
  console.log("Connected to port 8000");
});
