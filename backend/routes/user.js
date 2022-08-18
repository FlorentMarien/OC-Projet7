const express = require('express');
const multer = require('../middleware/multer-config');
const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/signup', multer, userCtrl.signup);
router.post('/login', userCtrl.login);
router.post('/getlogin', auth, userCtrl.getlogin);

module.exports = router;
