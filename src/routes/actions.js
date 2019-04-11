const express = require('express');
const router = express.Router();

const jwtReader = require('../middlewares/jwtReader');
router.use(jwtReader);

const actionsController = require('../controllers/actions');
router.post('/create', actionsController.create);
router.post('/inProgress', actionsController.inProgress);
router.post('/end', actionsController.end);
router.get('/list/:groupId/:type', actionsController.list);

module.exports = router;
