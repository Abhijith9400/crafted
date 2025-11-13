const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    subject: { type: String, required: false },
    title: { type: String, required: true },
    date: { type: String, required: true },

    // ⭐ VERY IMPORTANT (Fix student ID undefined)
    targetType: {
      type: String,
      enum: ["batch", "student"],
      required: true
    },
    targetValue: {
      type: String,
      required: true
    },

    // Uploaded PDF fields
    pdf: String,          // original file name
    pdfUrl: String,       // cloudinary URL
    cloudinaryId: String, // cloudinary file reference
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exam", examSchema);
