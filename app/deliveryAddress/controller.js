const DeliveryAddress = require('./model')

const create = async (req, res, next) => { 
    try {
        let payload = req.body
        let user = req.user

        let address = new DeliveryAddress({ ...payload, user: user._id })
        await address.save()
        res.status(200).json({
            error: false,
            message: 'Delivery address successfully created',
            data: address
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

const update = async (req, res, next) => { 
    try {
        let payload = req.body
        let user = req.user

        let address = await DeliveryAddress.findOne({ _id: payload._id, user: user._id })
        if (!address) return res.status(404).json({
            error: true,
            message: 'Delivery address not found'
        })

        await DeliveryAddress.findByIdAndUpdate(address._id, payload)
        res.status(200).json({
            error: false,
            message: 'Delivery address successfully updated',
            data: address
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

const remove = async (req, res, next) => { 
    try {
        let payload = req.body
        let user = req.user

        let address = await DeliveryAddress.findOne({ _id: payload._id, user: user._id })
        if (!address) return res.status(404).json({
            error: true,
            message: 'Delivery address not found'
        })

        await DeliveryAddress.findByIdAndRemove(address._id)
        res.status(200).json({
            error: false,
            message: 'Delivery address successfully removed'
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
        let user = req.user

        let addresses = await DeliveryAddress.find({ user: user._id }).select('-user')
        if (!addresses) return res.status(404).json({
            error: true,
            message: 'Delivery addresses not found'
        })

        res.status(200).json({
            error: false,
            message: 'Delivery addresses successfully retrieved',
            data: addresses
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

module.exports = {
    create,
    update,
    remove,
    viewByUser
}