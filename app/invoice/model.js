const mongoose = require('mongoose')

const invoiceSchema = new mongoose.Schema({
    subTotal: {
        type: Number,
        required: true
    },
    deliveryFee: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    deliveryAddress: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['waiting payment', 'paid'],
        default: 'waiting payment'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Invoice', invoiceSchema)