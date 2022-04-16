const path = require('path');
const fs = require('fs');
const config = require('../config');
const Product = require('./productModel');

// get all controller
const viewAll = (req, res, next) => {
    if (req.query.search) {
        console.log(req.query.search);
        let text = req.query.search;
        Product.find({ name: { $regex: '.*' + text.toLowerCase() + '.*', $options: 'i' } }, (err, products) => {
            if (err) {
                next(err);
            }
            res.status(200).json({
                error: false,
                message: 'List of products',
                dataCount: products.length,
                data: products
            })
        });
    } else {
        Product.find({}, (err, products) => {
            if (err) {
                next(err);
            }
            res.status(200).json({
                error: false,
                message: 'List of products',
                dataCount: products.length,
                data: products
            })
        });
    }
}

// get one controller
const viewOne = (req, res, next) => {
    Product.findById(req.params.id, (err, product) => {
        if (err) {
            next(err);
        }
        res.status(200).json({
            error: false,
            message: 'Product successfully found',
            data: product
        })
    });
}

// post controller
const create = async (req, res, next) => {
    try {
        const payload = req.body;
        const image = req.file;
        if (image) {
            let tmp_path = image.path;
            let originalExt = image.originalname.split('.').pop();
            let fileName = "image-" + image.filename + "." + originalExt;
            let target_path = path.resolve(config.rootPath, `public/images/product/${fileName}`);

            const src = fs.createReadStream(tmp_path);
            const dest = fs.createWriteStream(target_path);
            src.pipe(dest);

            src.on('end', async () => {
                try {
                    let product = new Product({
                        ...payload,
                        image: {
                            fileName,
                            filePath: `${req.protocol}://${req.headers.host}/public/image/produst/${fileName}`
                        }
                    })
                    fs.unlinkSync(tmp_path);
                    await product.save();
                    return res.status(200).json({
                        error: false,
                        message: 'Product successfully created',
                        data: product
                    })
                } catch (err) {
                    fs.unlinkSync(target_path);
                    if(err && err.name === "ValidationsError") {
                        return res.status(400).json({
                            error: true,
                            message: err.message,
                            fields: err.errors
                        })
                    }
                    next(error);
                }
            })

            src.on('error', async (err) => {
                next(err);
            });

        } else {
            let product = new Product(payload);
            await product.save();
            return res.status(200).json({
                error: false,
                message: 'Product successfully created',
                data : product
            })
        }
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

// put controller
const update = async (req, res, next) => {
    try {
        const image = req.file;
        const payload = req.body;

        if (image) {
            let tmp_path = image.path;
            let originalExt = image.originalname.split('.').pop();
            let fileName = "image-" + image.filename + "." + originalExt;
            let target_path = path.resolve(config.rootPath, `public/images/product/${fileName}`);

            const src = fs.createReadStream(tmp_path);
            const dest = fs.createWriteStream(target_path);
            src.pipe(dest);

            src.on('end', async () => {
                try {
                    payload.image = {
                        fileName,
                        filePath: `${req.protocol}://${req.headers.host}/public/image/produst/${fileName}`
                    }
                    fs.unlinkSync(tmp_path);
                    await Product.findOneAndUpdate({ _id: req.params.id }, { $set: payload }, { new: true })
                    return res.status(200).json({
                        error: false,
                        message: 'Product successfully updated',
                        data: payload
                    })
                } catch (err) {
                    fs.unlinkSync(target_path);
                    if (err && err.name === "ValidationsError") {
                        return res.status(400).json({
                            error: true,
                            message: err.message,
                            fields: err.errors
                        })
                    }
                    next(err);
                }
            })
        } else { 
            await Product.findOneAndUpdate({ _id: req.params.id }, { $set: payload }, { new: true })
            return res.status(200).json({
                error: false,
                message: 'Product successfully updated',
                data: payload
            })
        }

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

// delete controller
const remove = (req, res, next) => {
    Product.findByIdAndRemove(req.params.id, (err, product) => {
        if (err) {
            next(err);
        }
        res.status(200).json({
            error: false,
            message: 'Product successfully deleted',
            data: product
        })
    });
}

module.exports = {
    viewAll,
    viewOne,
    create,
    update,
    remove,
}