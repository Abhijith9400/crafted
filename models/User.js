const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: function () {
      return this.role === "admin" || this.role === "teacher" || this.role === "parent";
    }
  },
  studentId: {
    type: String,
    required: function () {
      return this.role === "student"; // only required for student
    }
  },
  email: { type: String },
  name: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "student", "teacher", "parent"], required: true },
  phone: { type: String, default: "" },
  subject: { type: String, default: "" }, // e.g. "Physics", "Chemistry", "Mathematics", "Biology"
  linkedStudentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", default: null },
  relationship: { type: String, default: "" },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
