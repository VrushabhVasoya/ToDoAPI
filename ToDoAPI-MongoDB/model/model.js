const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    first_name: {
        required: true,
        type: String
    },
    last_name: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('user_Datas', dataSchema)