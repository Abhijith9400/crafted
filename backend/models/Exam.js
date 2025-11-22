const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
  subject: String,
  title: String,
  date: String,
  pdf: String,              // filename
  targetType: String,       // "batch" | "student"
  targetValue: String,      // batch name OR student ID
});


module.exports = mongoose.model("Exam", examSchema);
