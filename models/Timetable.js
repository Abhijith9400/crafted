const mongoose = require("mongoose");

const TimetableSchema = new mongoose.Schema({
  day: { type: String, required: true },
  time: { type: String, required: true },
  subject: { type: String, required: true },
  teacher: { type: String, required: true },
  studentId: { type: String, default: null }, // Mapped to a specific student identity
  batch: { type: String, default: null }, // Mapped to a specific student batch (e.g. Batch 1, Batch 2)
});

module.exports = mongoose.model("Timetable", TimetableSchema);
