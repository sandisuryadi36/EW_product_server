const mongoose = require('mongoose')

const deliveryaddressSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: [3, 'Name must be at least 3 characters long'],
        maxlength: [50, 'Name must be at most 50 characters long'],
        required: [true, 'Address name is required']
    },
    kelurahan: {
        type: String,
        required: [true, 'Kelurahan is required'],
        maxlength: [255, 'Kelurahan must be at most 255 characters long']
    },
    kecamatan: {
        type: String,
        required: [true, 'Kecamatan is required'],
        maxlength: [255, 'Kecamatan must be at most 255 characters long']
    },
    kota: {
        type: String,
        required: [true, 'Kota is required'],
        maxlength: [255, 'Kota must be at most 255 characters long']
    },
    provinsi: {
        type: String,
        required: [true, 'Provinsi is required'],
        maxlength: [255, 'Provinsi must be at most 255 characters long']
    },
    detail: {
        type: String,
        required: [true, 'Detail is required'],
        maxlength: [1000, 'Detail must be at most 1000 characters long']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}, { timestamps: true })

module.exports = mongoose.model('DeliveryAddress', deliveryaddressSchema)