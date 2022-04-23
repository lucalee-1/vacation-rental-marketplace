const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Rental = require("./models/rental");

const app = express();

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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/rentals", async (req, res) => {
  const rentals = await Rental.find({});
  res.render("rentals/allRentals", { rentals });
});

app.get("/rentals/:id", async (req, res) => {
  const { id } = req.params;
  const rental = await Rental.findById(id);
  res.render("rentals/details", { rental });
});

app.listen(3000, () => {
  console.log("Connected to port 3000");
});
