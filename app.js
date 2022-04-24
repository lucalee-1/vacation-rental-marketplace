const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/rentals", async (req, res) => {
  const rentals = await Rental.find({});
  res.render("rentals/allRentals", { rentals });
});

app.post("/rentals", async (req, res) => {
  const rental = new Rental(req.body.rental);
  await rental.save();
  res.redirect(`/rentals/${rental._id}`);
});

app.get("/rentals/new", (req, res) => {
  res.render("rentals/addNew");
});

app.get("/rentals/:id", async (req, res) => {
  const { id } = req.params;
  const rental = await Rental.findById(id);
  res.render("rentals/details", { rental });
});

app.patch("/rentals/:id", async (req, res) => {
  const { id } = req.params;
  const rental = await Rental.findByIdAndUpdate(id, { ...req.body.rental });
  res.redirect(`/rentals/${rental._id}`);
});

app.delete("/rentals/:id", async (req, res) => {
  const { id } = req.params;
  const rental = await Rental.findByIdAndDelete(id);
  res.redirect("/rentals");
});

app.get("/rentals/:id/edit", async (req, res) => {
  const { id } = req.params;
  const rental = await Rental.findById(id);
  res.render("rentals/edit", { rental });
});

// app.use((req, res) => {
//   res.status(404)
//   res.render("notFound")
// })
app.listen(3000, () => {
  console.log("Connected to port 3000");
});
