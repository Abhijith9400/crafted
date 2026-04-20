const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  subject: { type: String, required: true },
  examType: { type: String, required: true },
  score: { type: Number, required: true },
  maxScore: { type: Number, required: true },
  grade: { type: String },
  date: { type: Date, default: Date.now },
  trend: { type: String }
});

module.exports = mongoose.model('Result', resultSchema);
