const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String },
  date: { type: String },
  title: { type: String },
  content: { type: String },
  filter: { type: String },
  token: { type: String }
});

module.exports = mongoose.model('User', userSchema);