const express = require('express');
const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');
const messageCtrl = require('../controllers/message');

const router = express.Router();

router.post('/send', auth, multer, messageCtrl.sendMessage);
router.post('/get', auth, messageCtrl.getMessages);
module.exports = router;
