const express = require('express');
const router = express.Router();

const jwtReader = require('../middlewares/jwtReader');
router.use(jwtReader);

const groupController = require('../controllers/group');
router.post('/join', groupController.join);
router.post('/create', groupController.create);
router.post('/changeSubgroup', groupController.changeSubgroup);
router.get('/members/:groupId', groupController.members);
router.get('/latestPings', groupController.latestPing);


module.exports = router;
