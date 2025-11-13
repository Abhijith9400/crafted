const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split("T")[0], // YYYY-MM-DD
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Announcement", announcementSchema);
