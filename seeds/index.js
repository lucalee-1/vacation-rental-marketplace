const mongoose = require("mongoose");
const Rental = require("../models/rental");
const cities = require("./cities");
const { descriptors, rentalType } = require("./seedTemplate");

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

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
  await Rental.deleteMany({});
  for (let i = 0; i <= 100; i++) {
    // 618 cities in the cities.js array
    const randomCity = Math.floor(Math.random() * 618);
    const rental = new Rental({
      title: `${sample(descriptors)} ${sample(rentalType)}`,
      location: `${cities[randomCity].city}, ${cities[randomCity].iso2}`,
    });
    await rental.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
