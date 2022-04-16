const router = require('express').Router();
const categoryController = require('./constroller');
const {policeCheck} = require('../../utils');

router.get('/category', categoryController.viewAll);
router.post('/category',
    policeCheck('create', 'Category'),
    categoryController.create
);
router.put('/category/:id',
    policeCheck('update', 'Category'),
    categoryController.update
);
router.delete('/category/:id',
    policeCheck('delete', 'Category'),
    categoryController.remove
);

module.exports = router;