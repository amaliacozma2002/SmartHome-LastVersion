const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true }, // parola hashuită
  role:     { type: String, default: 'user' }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
