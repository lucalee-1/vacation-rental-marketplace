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
    // 600 cities in the cities.js array
    const randomCity = Math.floor(Math.random() * 600);
    const randomPrice = Math.floor(Math.random() * 120) + 10;
    const rental = new Rental({
      title: `${sample(descriptors)} ${sample(rentalType)}`,
      price: randomPrice,
      location: `${cities[randomCity].city}, ${cities[randomCity].country}`,
      geometry: { type: "Point", coordinates: [cities[randomCity].lng, cities[randomCity].lat] },
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus, repellendus laborum accusamus et suscipit voluptatem tempore? Voluptatem quisquam, ab amet cumque, itaque officia incidunt earum qui temporibus labore nobis magni! Adipisci veniam aliquid recusandae itaque maiores? Nemo at distinctio id rem, maxime incidunt alias doloribus repudiandae sequi dolorem libero minima vero? Culpa, nulla. Suscipit, commodi ipsum quidem rerum fuga error.",
      images: [
        {
          url: "https://res.cloudinary.com/aefpxxc8p/image/upload/v1652430160/vacantion-rental/f2tyqfurlfxqdmimf3jo.jpg",
          fileName: "vacantion-rental/f2tyqfurlfxqdmimf3jo",
        },
        {
          url: "https://res.cloudinary.com/aefpxxc8p/image/upload/v1652430160/vacantion-rental/f2tyqfurlfxqdmimf3jo.jpg",
          fileName: "vacantion-rental/f2tyqfurlfxqdmimf3jo",
        },
      ],
      owner: "62711eb0c186d9c27a413308",
    });
    await rental.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
