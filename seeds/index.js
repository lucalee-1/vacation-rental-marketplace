const mongoose = require("mongoose");
const Rental = require("../models/rental");
const Review = require("../models/review");
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
  await Review.deleteMany({});
  for (let i = 0; i <= 100; i++) {
    // 525 cities in the cities.js array
    const randomCity = Math.floor(Math.random() * 525);
    const randomPrice = Math.floor(Math.random() * 120) + 10;
    const title = `${sample(descriptors)} ${sample(rentalType)}`;
    const rental = new Rental({
      title,
      price: randomPrice,
      location: `${cities[randomCity].city}, ${cities[randomCity].country}`,
      geometry: {
        type: "Point",
        coordinates: [cities[randomCity].lng, cities[randomCity].lat],
      },
      description: `This ${title} has everything you need for your ${cities[randomCity].city}, ${cities[randomCity].country} trip. The unit comes with Wi-Fi, TV and full climate control (AC + heating). During your stay, you can also enjoy using a convenient gym and pool. This ${title} offers complete privacy whilst still being conveniently close to everything you could ever need. It is within walking distance to several popular restaurants, shops, and beaches. An ideal base to relax and explore ${cities[randomCity].city}.`,
      images: [
        {
          url: "https://res.cloudinary.com/aefpxxc8p/image/upload/v1652965964/vacation-place/hotel-pool_t5cozh.jpg",
          fileName: "vacantion-place/hotel-pool_t5cozh",
        },
        {
          url: "https://res.cloudinary.com/aefpxxc8p/image/upload/v1652965964/vacation-place/hotel-outside_i070hx.jpg",
          fileName: "vacantion-place/hotel-outside_i070hx",
        },
        {
          url: "https://res.cloudinary.com/aefpxxc8p/image/upload/v1652965964/vacation-place/hotel-bedroom_bckq7y.jpg",
          fileName: "vacantion-place/hotel-bedroom_bckq7y",
        },
        {
          url: "https://res.cloudinary.com/aefpxxc8p/image/upload/v1652965964/vacation-place/hotel-bathroom_gf5rvq.jpg",
          fileName: "vacantion-place/hotel-bathroom_gf5rvq",
        },
      ],
      owner: "62711eb0c186d9c27a413308",
    });
    const review1 = new Review({
      rating: 5,
      body: `We had an amazing time at ${title}. The communication was super easy and quick and the place looks exactly like it does on the pictures. Would absolutely recommend it!`,
      owner: "62711eb0c186d9c27a413308",
    });
    const review2 = new Review({
      rating: 4,
      body: `The bedroom and bathroom were clean and everything was in good condition. It is a rare gem that is both centrally located AND very quiet. However, there are no screens on the windows, and bugs kept flying inside. In the end, we just kept the windows closed and used the air-conditioner.`,
      owner: "62711eb0c186d9c27a413308",
    });
    const review3 = new Review({
      rating: 5,
      body: `Very tidy and lovely ${title} equipped with everything you need. It is beautifully furnished with particular attention to all the details for the best comfort. A good bed and nice bathroom. We had a great stay!`,
      owner: "62711eb0c186d9c27a413308",
    });
    rental.reviews.push(review1);
    rental.reviews.push(review2);
    rental.reviews.push(review3);
    await review1.save();
    await review2.save();
    await review3.save();
    await rental.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
