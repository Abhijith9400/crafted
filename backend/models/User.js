const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: function () {
      return this.role === "admin"; // only required for admin
    }
  },
  studentId: {
    type: String,
    required: function () {
      return this.role === "student"; // only required for student
    }
  },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "student"], required: true }
});

module.exports = mongoose.model("User", UserSchema);
