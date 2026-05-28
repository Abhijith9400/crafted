const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
  subject: String,
  title: String,
  date: String,
  studentId: { type: String, default: null },
  pdf: String,
  exam_type: { type: String, default: "unit_test" },      // unit_test | practice | worksheet
  starts_at: { type: String, default: null },             // ISO datetime string
  duration_minutes: { type: Number, default: 60 },
}, { timestamps: true });

module.exports = mongoose.model("Exam", examSchema);
