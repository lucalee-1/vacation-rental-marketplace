const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RentalSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Rental must have a name']
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
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: "Review"
  }]
});

module.exports = mongoose.model("Rental", RentalSchema);
