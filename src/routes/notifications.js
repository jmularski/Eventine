const express = require('express');
const router = express.Router();

const jwtReader = require('../middlewares/jwtReader');
router.use(jwtReader);

const updateController = require('../controllers/notifications');
router.post('/updateToken', updateController.updateToken);

module.exports = router;
