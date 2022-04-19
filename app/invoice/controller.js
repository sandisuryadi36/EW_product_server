const Invoice = require('./model')

const viewByOrderNumber = async (req, res, next) => { 
    try {
        let { order_number } = req.params
        let user = req.user
        let invoice = await Invoice.findOne({ order_number: order_number, user: user._id })
            .populate('order')
            .populate('order.orderItems.product')
            .select('-user')
        if(!invoice) return res.json({
            error: true,
            message: 'Invoice not found'
        })
        res.json({
            error: false,
            message: 'Invoice successfully retrieved',
            data: invoice
        })
    } catch (err) { 
        next(err);
    }
}

const viewAllByUser = async (req, res, next) => { 
    try {
        let user = req.user
        let invoices = await Invoice.find({ user: user._id })
            .populate('order')
            .select('-user')
        if(!invoices) return res.json({
            error: true,
            message: 'Invoices not found'
        })
        res.json({
            error: false,
            message: 'Invoices successfully retrieved',
            data: invoices
        })
    } catch (err) { 
        next(err);
    }
}

const viewAll = async (req, res, next) => { 
    try {
        let invoices = await Invoice.find({})
            .populate('order')
            .populate('user')
        if(!invoices) return res.json({
            error: true,
            message: 'Invoices not found'
        })
        res.json({
            error: false,
            message: 'Invoices successfully retrieved',
            data: invoices
        })
    } catch (err) { 
        next(err);
    }
}

module.exports = {
    viewByOrderNumber,
    viewAllByUser,
    viewAll
}