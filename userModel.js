const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    orgType: { type: String, required: true },
    description: { type: String, required: true },
    approved: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema);
