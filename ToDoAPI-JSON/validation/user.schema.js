const joi = require("@hapi/joi");

const schema = {
  user: joi.object({
    firstname: joi.string().max(100).required(),
    lastname: joi.string().max(100).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).max(20).required(),
    token: joi.string(),
  }),
};

module.exports = schema;
