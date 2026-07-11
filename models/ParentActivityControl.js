const mongoose = require("mongoose");

const parentActivityControlSchema = new mongoose.Schema(
  {
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    dailyStudyGoalMinutes: { type: Number, default: 90, min: 0 },
    maxPracticeTestsPerDay: { type: Number, default: 2, min: 0 },
    allowRecordedClasses: { type: Boolean, default: true },
    allowPracticeExams: { type: Boolean, default: true },
    allowWeekendStudy: { type: Boolean, default: true },
    focusSubjects: { type: [String], default: [] },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

parentActivityControlSchema.index({ parent: 1, student: 1 }, { unique: true });

module.exports = mongoose.model("ParentActivityControl", parentActivityControlSchema);
