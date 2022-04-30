const mongoose = require('mongoose')

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: [2, 'Name must be at least 3 characters long'],
        maxlength: [20, 'Name must be at most 20 characters long'],
        required: true
    }
})

module.exports = mongoose.model('Tag', tagSchema)