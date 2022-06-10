const router = require('express').Router();
const { policeCheck } = require('../../utils');
const cartController = require('./controller');

router.put('/cart',
    policeCheck('update', 'Cart'),
    cartController.update
)
router.get('/cart',
    policeCheck('read', 'Cart'),
    cartController.viewByUser
)
router.delete('/cart/:id',
    policeCheck('delete', 'Cart'),
    cartController.remove
)

module.exports = router;