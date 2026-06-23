// backend/models/Student.js
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    course: { type: String, required: true }, // Used as Student Class/Grade (8-12th)
    batch: { type: String, default: "Batch 1" }, // Student batch (Batch 1 - 5)
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
