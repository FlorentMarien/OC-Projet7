const express = require('express');
const multer = require('../middleware/multer-config');
const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/signup', multer, userCtrl.signup);
router.post('/login', userCtrl.login);
router.post('/getlogin', auth, userCtrl.getlogin);
router.post('/sendimg', auth, multer, userCtrl.sendimg);
router.put('/modifpassword', auth, userCtrl.modifpassword);
router.put('/modifname', auth, userCtrl.modifname);
router.put('/modifemail', auth, userCtrl.modifemail);
router.put('/deletegallery', auth, userCtrl.deletegallery);
router.put('/modifpdp', auth, userCtrl.modifpdp);
router.post('/rechercheuser', auth, userCtrl.rechercheuser);

module.exports = router;
