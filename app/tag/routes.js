const router = require('express').Router();
const tagController = require('./controller');
const { policeCheck } = require('../../utils');

router.get('/tag', tagController.viewAll);
router.post('/tag',
    policeCheck('create', 'Tag'),
    tagController.create
);
router.put('/tag/:id',
    policeCheck('update', 'Tag'),
    tagController.update
);
router.delete('/tag/:id',
    policeCheck('delete', 'Tag'),
    tagController.remove
);

module.exports = router;