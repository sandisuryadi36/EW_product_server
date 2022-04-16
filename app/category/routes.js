const router = require('express').Router();
const categoryController = require('./categoryController');

router.get('/category', categoryController.viewAll);
router.post('/category', categoryController.create);
router.put('/category/:id', categoryController.update);
router.delete('/category/:id', categoryController.remove);

module.exports = router;