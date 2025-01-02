const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dashboard: { type: mongoose.Schema.Types.ObjectId, ref: 'Dashboard' }
  }, { timestamps: true });

  module.exports = mongoose.model('User', userSchema);