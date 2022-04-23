const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Lodging = require('./models/lodging');

const app = express();

mongoose.connect("mongodb://localhost:27017/lodging-marketplace"),
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
  res.render("home.ejs");
});

app.get('/newlodging', async (req, res) => {
    const lodging = new Lodging({title: "Farm house", price: 123 })
    await lodging.save();
    res.send(lodging)
})

app.listen(3000, () => {
  console.log("Connected to port 3000");
});
