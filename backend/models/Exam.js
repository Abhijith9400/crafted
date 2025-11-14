const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
  subject: String,
  title: String,
  date: String,
  pdf: String, // stores the filename of the uploaded PDF
});

module.exports = mongoose.model("Exam", examSchema);
