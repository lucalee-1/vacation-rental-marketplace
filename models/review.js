const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const ReviewSchema = new Schema({
    rating: Number,
    body: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})


module.exports = mongoose.model("Review", ReviewSchema)