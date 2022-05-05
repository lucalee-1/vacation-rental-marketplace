const Joi = require("joi");

module.exports.rentalSchema = Joi.object({
  rental: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(10).max(9999),
    location: Joi.string().required(),
    // image: Joi.string().required(),
    description: Joi.string().required(),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(0.5).max(5),
    body: Joi.string().required().min(1).max(9999),
  }).required(),
});
