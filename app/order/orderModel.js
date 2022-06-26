const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)
const Invoice = require('../invoice/model')
const Product = require('../product/model')
const OrderItem = require('./orderItemModel')

const orderSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ['waiting payment', 'paid', 'processing', 'in delivery', 'delivered', 'cancelled'],
        default: 'waiting payment'
    },
    deliveryFee: {
        type: Number,
        default: 0
    },
    deliveryAddress: {
        type: String,
        required: [true, 'Delivery address is required']
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
    },
    thumbnail: {
        type: String
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

// update invoice after paid
orderSchema.post('findOneAndUpdate', async function (doc, next) {
    if (doc.status === 'paid') {
        let invoice = await Invoice.findOne({ order: doc._id })
        invoice.paymentStatus = 'paid'
        await invoice.save()
        doc.orderItems.forEach(async (itemId) => {
            let item = await OrderItem.findById(itemId)
            let product = await Product.findById(item.product)
            product.stock -= item.quantity
            await product.save()
        })
    }
    next()
})

module.exports = mongoose.model('Order', orderSchema)