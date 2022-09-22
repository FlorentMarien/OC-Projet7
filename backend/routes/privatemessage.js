const express = require('express');
const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');
const privatemessageCtrl = require('../controllers/privatemessage');

const router = express.Router();

router.post('/get', auth, privatemessageCtrl.getMessages);
router.post('/send', auth, multer, privatemessageCtrl.sendMessage);
router.post('/getlastmessage', auth, privatemessageCtrl.getAllLastMessageofuser);

module.exports = router;
