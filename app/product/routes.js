const router = require('express').Router();
const multer = require('multer');
const os = require('os');

const productController = require('./productController');

router.get('/product', productController.viewAll);
router.get('/product/:id', productController.viewOne);
router.post('/product', multer({ dest: os.tmpdir() }).single("image"), productController.create);
router.put('/product/:id', multer({ dest: os.tmpdir() }).single("image"), productController.update);
router.delete('/product/:id', productController.remove);

module.exports = router;