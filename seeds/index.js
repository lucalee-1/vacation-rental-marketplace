const mongoose = require("mongoose");
const Lodging = require("../models/lodging");
const cities = require("./cities");
const { descriptors, lodgingType } = require("./seedTemplate");

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

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
  await Lodging.deleteMany({});
  for (let i = 0; i <= 100; i++) {
    // 675 cities in the cities.js array
    const randomCity = Math.floor(Math.random() * 675);
    const lodging = new Lodging({
      title: `${sample(descriptors)} ${sample(lodgingType)}`,
      location: `${cities[randomCity].city}, ${cities[randomCity].iso2}`,
    });
    await lodging.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
