const Joi = require('joi');

const bodySchema = new Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

const favoriteShcema = new Joi.object({
  favorite: Joi.boolean().required(),
});

module.exports = {
  bodySchema,
  favoriteShcema,
}
