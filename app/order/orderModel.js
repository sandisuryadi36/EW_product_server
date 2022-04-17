const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)
const Invoice = require('../invoice/model')

const orderSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ['waiting_payment', 'processing', 'in_delivery', 'delivered', 'cancelled'],
        default: 'waiting_payment'
    },
    deliveryFee: {
        type: Number,
        default: 0
    },
    deliveryAddress: {
        provinsi: { type: String, required: [true, 'Provinsi is required'] },
        kota: { type: String, required: [true, 'Kota is required'] },
        kecamatan: { type: String, required: [true, 'Kecamatan is required'] },
        kelurahan: { type: String, required: [true, 'Kelurahan is required'] },
        detail: { type: String, required: [true, 'Detail is required'] },
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem',
        required: true
    }],
    order_number: {
        type: Number
    }

}, { timestamps: true })

orderSchema.plugin(AutoIncrement, { inc_field: 'order_number' })
orderSchema.virtual('itemCount').get(function () { 
    return this.orderItems.reduce((total, item) => total += parseInt(item.quantity), 0)
})
orderSchema.post('save', async function () { 
    let subTotal = this.orderItems.reduce((total, item) => total += parseInt(item.total), 0)
    let invoice = new Invoice({
        user: this.user,
        order: this._id,
        subTotal: subTotal,
        deliveryFee: this.deliveryFee,
        total: subTotal + this.deliveryFee,
        deliveryAddress: this.deliveryAddress
    })
    await invoice.save()
})

module.exports = mongoose.model('Order', orderSchema)