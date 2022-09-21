const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    userId: { type: String, required: true },
    destuserId: { type: String, required: true },
    message: { type: String, required: true },
    imageUrl: { type: String },
    dateTime: { type: Date, required: true },
});
module.exports = mongoose.model('Privatemessage', messageSchema);
