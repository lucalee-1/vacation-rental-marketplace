const Joi = require("joi");

module.exports.rentalSchema = Joi.object({
  rental: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(10).max(9999),
    title: Joi.string().required(),
    image: Joi.string().required(),
    description: Joi.string().required(),
  }).required(),
});
