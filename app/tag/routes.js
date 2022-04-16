const router = require('express').Router();
const tagController = require('./constroller');

router.get('/tag', tagController.viewAll);
router.post('/tag', tagController.create);
router.put('/tag/:id', tagController.update);
router.delete('/tag/:id', tagController.remove);

module.exports = router;