const mongoose = require('mongoose')

const cartItemShcema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('CartItem', cartItemShcema)