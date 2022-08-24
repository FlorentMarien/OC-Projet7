const express = require('express');
const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');
const messageCtrl = require('../controllers/message');

const router = express.Router();

router.post('/get', auth, messageCtrl.getMessages);
router.post('/send', auth, multer, messageCtrl.sendMessage);
router.post('/sendlike', auth, messageCtrl.sendLike);
router.delete('/deleteMessage', auth, messageCtrl.deleteMessage);
router.put('/modifMessage', auth, multer, messageCtrl.modifMessage);
module.exports = router;
