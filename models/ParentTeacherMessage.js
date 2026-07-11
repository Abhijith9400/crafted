const mongoose = require("mongoose");

const parentTeacherMessageSchema = new mongoose.Schema(
  {
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["sent", "read", "replied"], default: "sent" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ParentTeacherMessage", parentTeacherMessageSchema);
