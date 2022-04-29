const Joi = require("joi");

module.exports.rentalSchema = Joi.object({
  rental: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(10).max(9999),
    title: Joi.string().required(),
    image: Joi.string().required(),
    description: Joi.string().required(),
  }).required()
});


module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(0.5).max(5),
    body: Joi.string().required().min(3).max(9999)
  }).required()
})