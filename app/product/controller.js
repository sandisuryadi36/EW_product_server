const path = require('path');
const fs = require('fs');
const config = require('../config');
const Product = require('./model');
const Category = require('../category/model');
const Tag = require('../tag/model');
const { initializeApp } = require("firebase/app");
const { deleteObject, getStorage, ref, getDownloadURL } = require("firebase/storage");
const { bucketName, clientEmail, privateKey, projectId } = require('../config');

const firebaseConfig = {
    apiKey: "AIzaSyDPoGbYtvtXfgCAjWz3uKTtDXmUtzFXp0Q",
    authDomain: "tech-shop-6a24f.firebaseapp.com",
    storageBucket: bucketName,
    messagingSenderId: "747838565547",
    appId: "1:747838565547:web:c884047b8ea0dab595dbee",
    projectId,
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage();

// get all controller
const viewAll = async (req, res, next) => {
    try {
        let { search = '', limit = 10, page = 1, category = '', tags = [] } = req.query;
        if (limit <= 0) { limit = 10 }
        if (page <= 0) { page = 1 }
        let totaldata = 0

        let filter = {}

        if (search.length > 0) { 
            filter.name = { $regex: '.*' + search + '.*', $options: 'i' }
        }

        if (category.length > 0) { 
            categoryQuery = await Category.findOne({ name: { $regex: '.*' + category + '.*', $options: 'i' } })
            if (categoryQuery) { 
                filter.category = categoryQuery._id
            } else {
                filter.category = null
            }
        }

        if (tags.length > 0) { 
            tagsQuery = await Tag.find({ name: { $in: tags } })
            if (tagsQuery.length > 0) {
                filter.tags = { $in: tagsQuery.map(tag => tag._id) }
            } else {
                filter.tags = null
            }
        }

        // console.log(filter)

        totaldata = await Product.countDocuments()
        let products = await Product.find(filter).skip((page - 1) * limit).limit(limit).populate('category').populate('tags')
        res.json({
            error: false,
            message: 'List of products',
            totaldata,
            dataViewed: products.length,
            page,
            limit,
            data: products
        })
    } catch (err) { 
        next(err);
    }
}

// get one controller
const viewOne = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate('category').populate('tags')
        if (!product) { 
            return res.json({
                error: true,
                message: 'Product not found',
                data: null
            })
        }
        res.json({
            error: false,
            message: 'Product successfully found',
            data: product
        })
    } catch (err) { 
        next(err);
    }
}

// post controller
const create = async (req, res, next) => {
    try {
        const payload = req.body;
        const image = req.file;

        if (payload.tags && payload.tags.length > 0) { 
            let tags = await Tag.find({ name: { $in: payload.tags } })
            if (tags.length > 0) {
                payload.tags = tags.map(tag => tag._id)
            } else {
                delete payload.tags
            }
        }

        if (image) {
            let originalExt = image.publicUrl.split('.').pop();
            let fileName = image.filename + "." + originalExt;

            let product = new Product({
                ...payload,
                image: {
                    fileName,
                    filePath: image.publicUrl
                }
            })
            
            let resProduct = await product.save()
            resProduct = await Product.findById(resProduct._id).populate('category').populate('tags')
            return res.json({
                error: false,
                message: 'Product successfully created',
                data: resProduct
            })
        } else {
            let product = new Product(payload);
            let resProduct = await product.save()
            resProduct = await Product.findById(resProduct._id).populate('category').populate('tags')
            return res.json({
                error: false,
                message: 'Product successfully created',
                data : resProduct
            })
        }
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

// put controller
const update = async (req, res, next) => {
    try {
        const image = req.file;
        const payload = req.body;

        if (payload.tags && payload.tags.length > 0) {
            let tags = await Tag.find({ name: { $in: payload.tags } })
            if (tags.length > 0) {
                payload.tags = tags.map(tag => tag._id)
            } else {
                delete payload.tags
            }
        }

        if (image) {
            let fileName = image.path.split('/').pop();

            payload.image = {
                fileName,
                filePath: image.publicUrl
            }

            let product = await Product.findById(req.params.id);

            // delete old image
            const oldImageRef = ref(storage, `images/${product.image.fileName}`);
            // oldImageRef.storage.getDownloadURL().then(onResolve, onReject);
            getDownloadURL(oldImageRef).then(onResolve, onReject);
            function onResolve(url) { 
                deleteObject(oldImageRef)
            }
            function onReject(error) { 
                console.log(error)
            }

            product = await Product.findOneAndUpdate({ _id: req.params.id }, { $set: payload }, { new: true, runValidators: true });
            product = await Product.findById(product._id).populate('category').populate('tags')
            return res.json({
                error: false,
                message: 'Product successfully updated',
                data: product
            })
        } else { 
            let product = await Product.findOneAndUpdate({ _id: req.params.id }, { $set: payload }, { new: true, runValidators: true })
            product = await Product.findById(product._id).populate('category').populate('tags')
            return res.json({
                error: false,
                message: 'Product successfully updated',
                data: product
            })
        }

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

// delete controller
const remove = async (req, res, next) => {
    try {
        let product = await Product.findByIdAndDelete(req.params.id)
        let oldImage = `${config.rootPath}/public/images/product/${product.image.fileName}`;
        if (fs.existsSync(oldImage)) {
            fs.unlinkSync(oldImage);
        }

        res.json({
            error: false,
            message: 'Product successfully deleted',
            data: product
        })
    } catch (err) {
        next(err);
    }
}

module.exports = {
    viewAll,
    viewOne,
    create,
    update,
    remove,
}