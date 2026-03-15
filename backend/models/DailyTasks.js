const mongoose = require('mongoose');

const DailyTaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    idNum: {type: Number, required: true}
});


module.exports = mongoose.model('DailyTasks', DailyTaskSchema);

