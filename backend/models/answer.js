const mongoose = require('mongoose');

const answerSchema = mongoose.Schema({
    userId: { type: String, required: true },
    message: { type: String, required: true },
    imageUrl: { type: String },
    answer: { type: Array },
    dateTime: { type: Date, required: true },
    Like: { type: Number },
    Dislike: { type: Number },
    arrayLike: { type: Array },
    arrayDislike: { type: Array },
});
module.exports = mongoose.model('Answer', answerSchema);
