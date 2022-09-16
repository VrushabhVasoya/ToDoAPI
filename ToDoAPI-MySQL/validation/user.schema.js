const joi = require("@hapi/joi");

const schema = {
    user: joi.object({
        first_name: joi.string().max(100).required(),
        last_name: joi.string().max(100).required(),
        email: joi.string().email().required(),
        password: joi.string().min(6).max(20).required(),
    }),
};

module.exports = schema;