const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    name: { type: String, required: true },
    userId: { type: String, required: true },
    destuserId: { type: String, required: true },
    message: { type: String },
    img: { type: String },
    dateTime: { type: Date, required: true },
});
module.exports = mongoose.model('Privatemessage', messageSchema);
