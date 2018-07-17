const express = require('express');
const router = express.Router();

const jwtReader = require('../middlewares/jwtReader');
router.use(jwtReader);

const notifController = require('../controllers/notifications');
router.post('/updateToken', notifController.updateToken);

module.exports = router;
