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

ImageSchema.virtual("thumbnailMini").get(function () {
  return this.url.replace("/upload", "/upload/c_fill,h_100,w_100");
});

ImageSchema.virtual("thumbnailBig").get(function () {
  return this.url.replace("/upload", "/upload/c_fill,h_350,w_350");
});

ImageSchema.virtual("detailsPage").get(function () {
  return this.url.replace("/upload", "/upload/c_fill,h_778,w_1152");
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
  return `<strong><a href="/rentals/${this._id}">${this.title}</a><strong>
  <p>${this.location}</p>
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
