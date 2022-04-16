const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: [3, 'Name must be at least 3 characters long'],
        required: true
    },
    description: {
        type: String,
        minlength: [3, 'Description must be at least 3 characters long'],
        maxlength: [1000, 'Description must be at most 1000 characters long'],
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    stock: {
        type: Number,
        min: 0
    },
    status: {
        type: Boolean,
        default: true
    },
    image: {
        fileName: {
            type: String,
        },
        filePath: {
            type: String,
        }
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
    }]
}, { timestamps: true })

const Product = mongoose.model('Product', productSchema)
module.exports = Product