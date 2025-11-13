// backend/models/Exam.js
const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    subject: { type: String, required: false },
    title: { type: String, required: true },
    date: { type: String, required: true },

    targetType: {
      type: String,
      enum: ["batch", "student"],
      required: true
    },
    targetValue: {
      type: String,
      required: true
    },

    pdf: String,          // original filename
    pdfUrl: String,       // cloudinary URL (secure)
    cloudinaryId: String, // cloudinary public id
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exam", examSchema);
