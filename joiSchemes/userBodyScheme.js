const Joi = require('joi');

const bodySchema = new Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
})

module.exports = {
  bodySchema,
}