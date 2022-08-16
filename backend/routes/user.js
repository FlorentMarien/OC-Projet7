const express = require('express');
const multer = require('../middleware/multer-config');
const userCtrl = require('../controllers/user');

const router = express.Router();

router.post('/signup', multer, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;
