const router = require('express').Router();
const userController = require('./controller');
const { policeCheck } = require('../../utils');

router.put('/user',
    policeCheck('update', 'User'),
    userController.update
)

module.exports = router