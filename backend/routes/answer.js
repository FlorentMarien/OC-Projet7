const express = require('express');
const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');
const messageCtrl = require('../controllers/answer');

const router = express.Router();

router.post('/get', auth, messageCtrl.getAnswer);
router.post('/send', auth, multer, messageCtrl.sendAnswer);
router.post('/sendlike', auth, messageCtrl.sendLike);
router.delete('/deleteMessage', auth, messageCtrl.deleteMessage);
module.exports = router;
