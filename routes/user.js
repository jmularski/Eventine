const express = require('express');
const router = express.Router();

const jwtReader = require('../middlewares/jwtReader');
router.use(jwtReader);

const groupController = require('../controllers/user');
router.get('/groupList', groupController.groupList);
router.get('/invitations', groupController.invitations);
router.get('/tasks', groupController.getTasks);
router.get('/friends', groupController.returnFriends);

module.exports = router;
