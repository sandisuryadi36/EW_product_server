const router = require('express').Router();
const multer = require('multer');
const os = require('os');
const { policeCheck } = require('../../utils');

const productController = require('./controller');

router.get('/product', productController.viewAll);
router.get('/product/:id', productController.viewOne);
router.post('/product',
    multer({ dest: os.tmpdir() }).single("image"),
    policeCheck('create', 'Product'),
    productController.create
);
router.put('/product/:id',
    multer({ dest: os.tmpdir() }).single("image"),
    policeCheck('update', 'Product'),
    productController.update
);
router.delete('/product/:id',
    policeCheck('delete', 'Product'),
    productController.remove
);

module.exports = router;