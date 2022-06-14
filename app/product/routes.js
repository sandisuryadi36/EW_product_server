const router = require('express').Router();
const Multer = require('multer');
const FirebaseStorage = require('multer-firebase-storage')
const os = require('os');
const { policeCheck } = require('../../utils');
const { bucketName, clientEmail, privateKey, projectId } = require('../config');

const productController = require('./controller');

const multer = Multer({
    storage: FirebaseStorage({
        bucketName,
        credentials: { clientEmail, privateKey: privateKey.replace(/\\n/g, '\n'), projectId },
        directoryPath: "images",
        unique: true,
        public: true
    })
})

router.get('/product', productController.viewAll);
router.get('/product/:id', productController.viewOne);
router.post('/product',
    multer.single("image"),
    policeCheck('create', 'Product'),
    productController.create
);
router.put('/product/:id',
    multer.single("image"),
    policeCheck('update', 'Product'),
    productController.update
);
router.delete('/product/:id',
    policeCheck('delete', 'Product'),
    productController.remove
);

module.exports = router;