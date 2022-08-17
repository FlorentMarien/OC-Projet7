const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    userId: { type: String, required: true },
    messageId: { type: String, required: true, unique: true },
    message: { type: String, required: true },
    imageUrl: { type: String },
    answer: { type: Array },
    reply: { type: Boolean },
    dateTime: { type: Date, required: true },
    Like: { type: Number },
    Dislike: { type: Number },
    arrayLike: { type: Array },
    arrayDislike: { type: Array },
});
module.exports = mongoose.model('Message', messageSchema);
