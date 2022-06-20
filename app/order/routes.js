const router = require('express').Router();
const { policeCheck } = require('../../utils');
const orderController = require('./controller');

router.post('/order',
    policeCheck('create', 'Order'),
    orderController.create
)
router.get('/order',
    policeCheck('read', 'Order'),
    orderController.viewByUser
)
router.get('/order/:id',
    policeCheck('read', 'Order'),
    orderController.viewById
)
router.get('/order-all',
    policeCheck('view', 'Order'),
    orderController.viewAll
)
router.put('/order/:id',
    policeCheck('update', 'Order'),
    orderController.update
)

module.exports = router;