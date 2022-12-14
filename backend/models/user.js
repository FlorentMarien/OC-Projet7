const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    prename: { type: String, required: true },
    imageUrl: { type: String, required: true },
    imageArray: { type: Array },
    adminLevel: { type: Number, default: 0 },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
