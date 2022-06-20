const DeliveryAddress = require('../deliveryAddress/model')
const CartItem = require('../cart/itemModel')
const OrderItem = require('./orderItemModel')
const Order = require('./orderModel')
const { Types } = require('mongoose')

const create = async (req, res, next) => { 
    try {
        let { deliveryFee, deliveryAddressID } = req.body
        let items = await CartItem.find({ user: req.user._id }).populate('product')
        if (!items) {
            return res.json({
                error: true,
                message: 'Cart is empty'
            })
        }
        let address = await DeliveryAddress.findOne({ _id: deliveryAddressID })
        let order = new Order({
            _id : Types.ObjectId(),
            status: 'waiting payment',
            deliveryFee,
            orderImageUrl: items[0].product.image.filePath,
            deliveryAddress: address.addressString,
            user: req.user._id
        })
        let orderItems = await OrderItem.insertMany(items.map(item => ({ 
            ...item,
            productName: item.product.name,
            price: parseInt(item.product.price),
            quantity: parseInt(item.quantity),
            total: parseInt(item.total),
            order: order._id,
            product: item.product._id
        })))
        orderItems.forEach(item => order.orderItems.push(item))
        await order.save()
        await CartItem.deleteMany({ user: req.user._id })
        return res.json({
            error: false,
            message: 'Order successfully created',
            data: order
        })

    } catch (err) { 
        if (err && err.name === "ValidationError") { 
            return res.json({
                error: true,
                message: err.message,
                fields: err.errors
            })
        }
        next(err);
    }
}

const viewByUser = async (req, res, next) => { 
    try {
        let { page = 1 , limit = 10 } = req.query
        let orders = await Order.find({ user: req.user._id })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('orderItems')
            .populate('deliveryAddress')
            .select('-user')
            .sort({ createdAt: -1 })
        if (!orders) return res.json({
            error: true,
            message: 'Orders not found'
        })

        return res.json({
            error: false,
            message: 'Orders successfully retrieved',
            data: orders
        })

    } catch (err) { 
        if (err && err.name === "ValidationError") { 
            return res.json({
                error: true,
                message: err.message,
                fields: err.errors
            })
        }
        next(err);
    }
}

const viewById = async (req, res, next) => { 
    try {
        let order = await Order.findOne({ _id: req.params.id })
            .populate('orderItems')
            .populate('deliveryAddress')
            .populate('user')
            .select('-user')
        if (!order) return res.json({
            error: true,
            message: 'Order not found'
        })

        return res.json({
            error: false,
            message: 'Order successfully retrieved',
            data: order
        })

    } catch (err) { 
        if (err && err.name === "ValidationError") { 
            return res.json({
                error: true,
                message: err.message,
                fields: err.errors
            })
        }
        next(err);
    }
}

const viewAll = async (req, res, next) => { 
    try {
        let { page = 1 , limit = 10 } = req.query
        let orders = await Order.find({})
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('orderItems.product')
            .populate('deliveryAddress')
            .populate('user')
            .sort({ createdAt: -1 })
        if (!orders) return res.json({
            error: true,
            message: 'Orders not found'
        })

        return res.json({
            error: false,
            message: 'Orders successfully retrieved',
            data: orders
        })

    } catch (err) { 
        if (err && err.name === "ValidationError") { 
            return res.json({
                error: true,
                message: err.message,
                fields: err.errors
            })
        }
        next(err);
    }
}

module.exports = {
    create,
    viewByUser,
    viewAll,
    viewById
}