const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    user_id: {
        required: true,
        type: String
    },
    task: {
        required: true,
        type: String
    },
    complete: {
        required: true,
        type: Boolean
    }
})

module.exports = mongoose.model('todo_datas', dataSchema)