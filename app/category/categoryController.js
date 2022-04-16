const Category = require('./categoryModel')

const create = async (req, res, next) => { 
    try {
        const category = await Category.create(req.body)
        res.status(200).json({
            error: false,
            message: 'Category successfully created',
            data: category
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
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        res.status(200).json({
            error: false,
            message: 'Category successfully updated',
            data: category
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
        const category = await Category.findByIdAndDelete(req.params.id)
        res.status(200).json({
            error: false,
            message: 'Category successfully deleted',
            data: category
        })
    } catch (err) { 
        next(err);
    }
}

const viewAll = async (req, res, next) => { 
    try {
        const categories = await Category.find({})
        res.status(200).json({
            error: false,
            message: 'Categories successfully retrieved',
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