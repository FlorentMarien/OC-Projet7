const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        console.log(file);
        const name = file.originalname.split(' ').join('_');
        callback(null, Date.now() + '-' + name);
    },
});

module.exports = multer({ storage: storage }).array('image');
