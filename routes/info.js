const express = require('express');
const router = express.Router();

const jwtReader = require('../middlewares/jwtReader');
router.use(jwtReader);

const infoController = require('../controllers/info');
router.post('/create', infoController.create);
router.get('/list/:groupId', infoController.list);

module.exports = router;
