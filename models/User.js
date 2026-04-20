const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: function () {
      return this.role === "admin" || this.role === "teacher"; // required for admin and teacher
    }
  },
  studentId: {
    type: String,
    required: function () {
      return this.role === "student"; // only required for student
    }
  },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "student", "teacher"], required: true }
});

module.exports = mongoose.model("User", UserSchema);
