const express = require('express');
const router = express.Router();

const jwtReader = require('../middlewares/jwtReader');
router.use(jwtReader);

const groupController = require('../controllers/user');
router.get('/list/:userId', groupController.list);
router.get('/invitations', groupController.invitations);

module.exports = router;