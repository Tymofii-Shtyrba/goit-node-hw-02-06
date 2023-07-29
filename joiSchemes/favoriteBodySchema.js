const Joi = require('joi');

const favoriteSchema = new Joi.object({
  favorite: Joi.boolean().required(),
});

module.exports = {
  favoriteSchema,
}

