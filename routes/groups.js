const express = require('express');
const router = express.Router();

const jwtReader = require('../middlewares/jwtReader');
router.use(jwtReader);

const groupController = require('../controllers/group');
router.post('/join', groupController.join);
router.post('/create', groupController.create);
router.post('/acceptInvitation', groupController.acceptInvitation);
router.get('/list/:userId', groupController.list);
router.get('/invitations/:userId', groupController.invitations);
router.get('/latestPings/:userId', groupController.latestPing);


module.exports = router;