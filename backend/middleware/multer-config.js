const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        // const extension = MIME_TYPES[file.mimetype];
        callback(null, Date.now() + '-' + name);
    },
});

module.exports = multer({ storage: storage }).single('image');
