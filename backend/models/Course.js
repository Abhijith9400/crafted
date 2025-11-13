// models/Course.js
const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true },
    students: { type: Number, default: 0 },
    color: { type: String, default: "#2196F3" },
    videoUrl: { type: String, default: "" } // ✅ YouTube video link
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", CourseSchema);
