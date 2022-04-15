const path = require('path');
const fs = require('fs');
const config = require('../config');
const Product = require('./productModel');

// // get all controller
// const viewAll = (req, res, next) => {
//     if (req.query.search) {
//         console.log(req.query.search);
//         let text = req.query.search;
//         Product.find({ name: { $regex: '.*' + text.toLowerCase() + '.*', $options: 'i' } }, (err, products) => {
//             if (err) {
//                 res.send(err);
//             }
//             res.json(products);
//         });
//     } else {
//         Product.find({}, (err, products) => {
//             if (err) {
//                 res.send(err);
//             }
//             res.json(products);
//         });
//     }
// }

// // get one controller
// const viewOne = (req, res, next) => {
//     Product.findById(req.params.id, (err, product) => {
//         if (err) {
//             res.send(err);
//         }
//         res.json(product);
//     });
// }

// post controller
const create = async (req, res, next) => {
    try {
        let payload = req.body;
        const image = req.file;
        if (image) {
            let tmp_path = image.path;
            let originalExt = image.originalname.split('.').pop();
            let fileName = image.originalname + "." + originalExt;
            let target_path = path.resolve(config.rootPath, `public/image/product/${fileName}`);

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
                    console.log(product.name);
                    await product.save();
                    return res.status(200).json({
                        error: false,
                        message: 'Product successfully created',
                        data: product
                    })
                } catch (error) {
                    fs.unlinkSync(target_path);
                    if(err && error.name === "ValidationsError") {
                        return res.status(400).json({
                            error: true,
                            message: error.message,
                            fields: error.errors
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
            console.log(product.name);
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

// // put controller
// const update = (req, res, next) => {
//     const image = req.file;
//     const updatedProduct = req.body;

//     if (image) {
//         const target = path.join("uploads", image.originalname)
//         fs.renameSync(image.path, target);
//         updatedProduct.image = {
//             fileName: image.originalname,
//             filePath: `${req.protocol}://${req.headers.host}/public/${encodeURI(image.originalname)}`
//         }
//     }
//     Product.findOneAndUpdate({ _id: req.params.id }, { $set: updatedProduct },{new: true}, (err, product) => { 
//         if (err) {
//             res.send(err);
//         }
//         res.json({
//             message: 'Product successfully updated',
//             product
//         });
//     })
// }

// // delete controller
// const remove = (req, res, next) => {
//     Product.findByIdAndRemove(req.params.id, (err, product) => {
//         if (err) {
//             res.send(err);
//         }
//         res.json({
//             message: 'Product successfully deleted',
//             product
//         });
//     });
// }

module.exports = {
    // viewAll,
    // viewOne,
    create
    // update,
    // remove,
}