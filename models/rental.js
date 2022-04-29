const mongoose = require("mongoose");
const Review = require("./review")
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

RentalSchema.post('findOneAndDelete', async function (doc) {
 if(doc){
   await Review.deleteMany({
     _id: {
       $in: doc.reviews
     }
   })
 }
})

module.exports = mongoose.model("Rental", RentalSchema);
