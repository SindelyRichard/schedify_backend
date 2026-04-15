const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  resetCode: { tpye: String },
  codeExpire: { type: Date },
  tasksCompleted: { type: Number, default: 0 }
});

module.exports = mongoose.model('User', UserSchema);