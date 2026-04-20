const mongoose = require('mongoose');

const AdminProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  address: { type: String },
  position: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('AdminProfile', AdminProfileSchema);
