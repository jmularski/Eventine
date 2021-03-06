const express = require('express');
const router = express.Router();

const jwtReader = require('../middlewares/jwtReader');
router.use(jwtReader);

const userController = require('../controllers/user');
router.get('/groupList', userController.groupList);
router.get('/invitations', userController.invitations);
router.get('/tasks', userController.getTasks);
router.get('/friends', userController.returnFriends);
router.post('/setCaretaker', userController.setCaretaker);
router.post('/callCaretaker', userController.callCaretaker);

module.exports = router;
