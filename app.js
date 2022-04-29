const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const ExpressError = require("./helpers/ExpressError");
const methodOverride = require("method-override");

const rentals = require("./routes/rentals")
const reviews = require("./routes/reviews")


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



app.use("/rentals", rentals)
app.use("/rentals/:id/reviews", reviews)


app.get("/", (req, res) => {
  res.render("home");
});

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
