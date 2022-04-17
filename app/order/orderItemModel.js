const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        min: [1, 'Quantity must be at least 1'],
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
    }
})

module.exports = mongoose.model('OrderItem', orderItemSchema)