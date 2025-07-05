const mongoose = require('mongoose');

const MotivationSchema = new mongoose.Schema({
    title: { type: String, required: true }
});

module.exports = mongoose.model('Motivation', MotivationSchema);