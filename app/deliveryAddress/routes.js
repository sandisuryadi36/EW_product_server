const router = require('express').Router();
const { policeCheck } = require('../../utils');
const deliveryAddressController = require('./controller');

router.post('/delivery-address',
    policeCheck('create', 'DeliveryAddress'),
    deliveryAddressController.create
)
router.put('/delivery-address/:id',
    policeCheck('update', 'DeliveryAddress'),
    deliveryAddressController.update
)
router.delete('/delivery-address/:id',
    policeCheck('delete', 'DeliveryAddress'),
    deliveryAddressController.remove
)
router.get('/delivery-address',
    policeCheck('read', 'DeliveryAddress'),
    deliveryAddressController.viewByUser
)

module.exports = router;