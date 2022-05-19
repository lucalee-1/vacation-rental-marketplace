const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} cannot not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

module.exports.rentalSchema = Joi.object({
  rental: Joi.object({
    title: Joi.string().required().escapeHTML(),
    price: Joi.number().required().min(10).max(9999),
    location: Joi.string().required().escapeHTML(),
    // image: Joi.string().required(),
    description: Joi.string().required().escapeHTML(),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(0.5).max(5),
    body: Joi.string().required().min(1).max(9999).escapeHTML(),
  }).required(),
});
