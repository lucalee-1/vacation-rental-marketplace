const { string } = require("joi");
const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const ImageSchema = new Schema({
  url: String,
  fileName: String,
});
ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/c_fill,h_200,w_200");
});

ImageSchema.virtual("thumbnailMd").get(function () {
  return this.url.replace("/upload", "/upload/c_fill,h_300,w_300");
});

ImageSchema.virtual("thumbnailBig").get(function () {
  return this.url.replace("/upload", "/upload/c_fill,h_500,w_500");
});

ImageSchema.virtual("detailsPage").get(function () {
  return this.url.replace("/upload", "/upload/c_fill,h_856,w_1152");
});

const RentalSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Rental must have a name"],
    },
    price: {
      type: Number,
    },
    location: {
      type: String,
    },
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    description: {
      type: String,
    },
    images: [ImageSchema],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  opts
);

RentalSchema.virtual("properties.popUpMarkup").get(function () {
  return `<strong><a href="/rentals/${this._id}"><h5>${this.title}</h5></a></strong>
  <h6>${this.location}</h6>
  <p>${this.description.substring(0,40)}...</p>`
});

RentalSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Rental", RentalSchema);
