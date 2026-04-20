const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
  subject: String,
  title: String,
  date: String,
  studentId: { type: String, default: null }, // Maps specific question-paper PDFs to a student
  pdf: String, // stores the filename of the uploaded PDF
});

module.exports = mongoose.model("Exam", examSchema);
