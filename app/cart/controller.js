const CartItem = require('./itemModel')
const Product = require('../product/model')

const update = async (req, res, next) => { 
    try {
        const payload = req.body
        const user = req.user
        const product = await Product.findById(payload.product)
        if (!product) return res.status(404).json({
            error: true,
            message: 'Product not found'
        })
        payload.productName = product.name
        payload.price = product.price
        payload.imageUrl = product.image.filePath
        payload.total = payload.quantity * payload.price

        const cartIten = await CartItem.findOneAndUpdate(
            { product: payload.product, user: user._id },
            payload,
            { new: true, upsert: true, runValidators: true }
        )
        res.status(200).json({
            error: false,
            message: 'Cart item successfully updated',
            data: cartIten
        })
    } catch (err) { 
        if (err && err.name === "ValidationError") { 
            return res.status(400).json({
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
        const user = req.user
        const cartItems = await CartItem.find({ user: user._id }).select('-user')
        res.status(200).json({
            error: false,
            message: 'Cart items successfully retrieved',
            data: cartItems
        })
    } catch (err) { 
        next(err);
    }
}

module.exports = {
    update,
    viewByUser
}