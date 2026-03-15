const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    lastCompletedDate: { type: Date, default: null },
    dtId: {type: Number, required:true}
});


module.exports = mongoose.model('Progress', ProgressSchema);

