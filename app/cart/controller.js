const CartItem = require('./itemModel')
const Product = require('../product/model')

const update = async (req, res, next) => { 
    try {
        const payload = req.body
        const user = req.user
        const product = await Product.findById(payload.product)
        if (!product) return res.json({
            error: true,
            message: 'Product not found'
        })

        if (product.stock < payload.quantity) return res.json({
            error: true,
            message: 'Not enough stock'
        })
        
        payload.productName = product.name
        payload.price = product.price
        payload.imageUrl = product.image.filePath
        payload.total = payload.quantity * payload.price

        const cartItem = await CartItem.findOneAndUpdate(
            { product: payload.product, user: user._id },
            payload,
            { new: true, upsert: true, runValidators: true }
        )
        res.json({
            error: false,
            message: 'Cart item successfully updated',
            data: cartItem
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
        let filter = {}
        filter.user = req.user._id
        if (req.query.productID) filter.product = req.query.productID
        const cartItems = await CartItem.find(filter).select('-user')
        res.json({
            error: false,
            message: 'Cart items successfully retrieved',
            data: cartItems
        })
    } catch (err) { 
        next(err);
    }
}

const remove = async (req, res, next) => { 
    try {
        await CartItem.findOneAndDelete({ _id: req.params.id })
        res.json({
            error: false,
            message: 'Cart item successfully deleted'
        })
    } catch (err) {
        next(err);
    }
}

module.exports = {
    update,
    viewByUser,
    remove
}