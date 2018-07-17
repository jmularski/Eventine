const express = require('express');
const router = express.Router();

const jwtReader = require('../middlewares/jwtReader');
router.use(jwtReader);

const pingController = require('../controllers/ping');
router.post('/create', pingController.create);
router.post('/inProgress', pingController.inProgress);
router.post('/end', pingController.end);
router.get('/list/:groupId', pingController.list);

module.exports = router;
