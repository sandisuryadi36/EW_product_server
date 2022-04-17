const router = require('express').Router();
const { policeCheck } = require('../../utils');
const invoiceController = require('./controller');

router.get('/invoice',
    policeCheck('read', 'Invoice'),
    invoiceController.viewAllByUser
)
router.get('/invoice/:order_number',
    policeCheck('read', 'Invoice'),
    invoiceController.viewByOrderNumber
)
router.get('/invoice-all',
    policeCheck('view', 'Invoice'),
    invoiceController.viewAll
)

module.exports = router;