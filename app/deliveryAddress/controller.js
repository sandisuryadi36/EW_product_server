const DeliveryAddress = require('./model')

const create = async (req, res, next) => { 
    try {
        let payload = req.body
        let user = req.user

        let address = new DeliveryAddress({ ...payload, user: user._id })
        await address.save()
        res.json({
            error: false,
            message: 'Delivery address successfully created',
            data: address
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

const update = async (req, res, next) => { 
    try {
        let payload = req.body
        let user = req.user

        let address = await DeliveryAddress.findOne({ _id: req.params.id, user: user._id })
        if (!address) return res.json({
            error: true,
            message: 'Delivery address not found'
        })

        await DeliveryAddress.findByIdAndUpdate(address._id, payload)
        res.json({
            error: false,
            message: 'Delivery address successfully updated',
            data: address
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

const remove = async (req, res, next) => { 
    try {
        let payload = req.body
        let user = req.user

        let address = await DeliveryAddress.findOne({ __id: req.params.id, user: user._id })
        if (!address) return res.json({
            error: true,
            message: 'Delivery address not found'
        })

        await DeliveryAddress.findByIdAndRemove(address._id)
        res.json({
            error: false,
            message: 'Delivery address successfully removed'
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
        let user = req.user

        let addresses = await DeliveryAddress.find({ user: user._id }).select('-user')
        if (!addresses) return res.json({
            error: true,
            message: 'Delivery addresses not found'
        })

        res.json({
            error: false,
            message: 'Delivery addresses successfully retrieved',
            data: addresses
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
        let addresses = await DeliveryAddress.find({}).populate('user', '-password -__v -createdAt -updatedAt -token')
        if (!addresses) return res.json({
            error: true,
            message: 'Delivery addresses not found'
        })

        res.json({
            error: false,
            message: 'Delivery addresses successfully retrieved',
            data: addresses
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
    update,
    remove,
    viewByUser,
    viewAll
}