const Joi = require("joi")

const authSchema = Joi.object({
    first_name: Joi.string().max(50).required(),
    last_name: Joi.string().max(50).required(),
    email: Joi.string().max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
})

module.exports = { authSchema }