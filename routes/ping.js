const express = require('express');
const router = express.Router();

const jwtReader = require('../middlewares/jwtReader');
router.use(jwtReader);

var pingController = require('../controllers/ping');

module.exports = router;