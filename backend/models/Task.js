const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    title: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    lastCompletedDate: { type: Date, default: null }
});


module.exports = mongoose.model('Task', TaskSchema);

