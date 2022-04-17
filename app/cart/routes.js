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

module.exports = router;