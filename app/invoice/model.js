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
        provinsi: { type: String, required: [true, 'Provinsi is required'] },
        kota: { type: String, required: [true, 'Kota is required'] },
        kecamatan: { type: String, required: [true, 'Kecamatan is required'] },
        kelurahan: { type: String, required: [true, 'Kelurahan is required'] },
        detail: { type: String, required: [true, 'Detail is required'] },
    },
    paymentStatus: {
        type: String,
        enum: ['waiting_payment', 'paid'],
        default: 'waiting_payment'
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