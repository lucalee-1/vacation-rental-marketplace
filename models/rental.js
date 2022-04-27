const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RentalSchema = new Schema({
  title: {
    type: String,
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  description: {
    type: String,
  },
  image: {
    type: String,    
  },
});

module.exports = mongoose.model("Rental", RentalSchema);
