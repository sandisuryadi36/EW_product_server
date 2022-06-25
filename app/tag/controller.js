const Tag = require('./model')

const create = async (req, res, next) => { 
    try {
        const tag = await Tag.create(req.body, { new: true, runValidators: true })
        res.json({
            error: false,
            message: 'Tag successfully created',
            data: tag
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
        const tag = await Tag.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        res.json({
            error: false,
            message: 'Tag successfully updated',
            data: tag
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
        const tag = await Tag.findByIdAndDelete(req.params.id)
        res.json({
            error: false,
            message: 'Tag successfully deleted',
            data: tag
        })
    } catch (err) { 
        next(err);
    }
}

const viewAll = async (req, res, next) => { 
    try {
        const categories = await Tag.find({})
        res.json({
            error: false,
            message: 'Tags successfully retrieved',
            data: categories
        })
    } catch (err) { 
        next(err);
    }
}

module.exports = {
    create,
    update,
    remove,
    viewAll
}