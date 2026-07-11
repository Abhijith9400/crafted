const express = require("express");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User");
const Student = require("../models/Student");
const Result = require("../models/Result");
const Timetable = require("../models/Timetable");
const Exam = require("../models/Exam");
const RecordedClass = require("../models/RecordedClass");
const ParentActivityControl = require("../models/ParentActivityControl");
const ParentTeacherMessage = require("../models/ParentTeacherMessage");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

const findStudent = async (studentId) => {
  const studentQuery = mongoose.isValidObjectId(studentId)
    ? { $or: [{ _id: studentId }, { studentId }] }
    : { studentId };
  return Student.findOne(studentQuery);
};

const normalizeParent = (parent) => ({
  id: parent._id,
  _id: parent._id,
  username: parent.username,
  email: parent.email,
  name: parent.name,
  phone: parent.phone,
  relationship: parent.relationship || "Parent",
  status: parent.status || "active",
  student: parent.linkedStudentId,
  createdAt: parent.createdAt,
});

// Parent accounts are stored in User, same as teacher/admin accounts.
router.get("/", async (req, res) => {
  try {
    const parents = await User.find({ role: "parent" })
      .populate("linkedStudentId")
      .sort({ createdAt: -1 })
      .select("-password");
    res.json(parents.map(normalizeParent));
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch parents" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { username, email, password, name, phone, studentId, relationship } = req.body;
    if (!email || !password || !name || !studentId) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const student = await findStudent(studentId);
    if (!student) return res.status(404).json({ message: "Linked student not found" });

    const parentUsername = username || email;
    const existing = await User.findOne({
      role: "parent",
      $or: [{ username: parentUsername }, { email }],
    });
    if (existing) return res.status(400).json({ message: "Parent username or email already exists" });

    const parent = new User({
      username: parentUsername,
      email,
      name,
      password: await bcrypt.hash(password, 10),
      role: "parent",
      phone: phone || "",
      linkedStudentId: student._id,
      relationship: relationship || "Parent",
      status: "active",
    });

    const saved = await parent.save();
    await saved.populate("linkedStudentId");
    saved.password = undefined;
    res.status(201).json(normalizeParent(saved));
  } catch (err) {
    res.status(500).json({ message: "Failed to create parent" });
  }
});

router.get("/me", auth, async (req, res) => {
  try {
    if (req.user.role !== "parent") {
      return res.status(403).json({ message: "Parent access required" });
    }

    const parent = await User.findOne({ _id: req.user.id, role: "parent" })
      .populate("linkedStudentId")
      .select("-password");
    if (!parent) return res.status(404).json({ message: "Parent account not found" });
    if (!parent.linkedStudentId) return res.status(404).json({ message: "Linked student not found" });

    const student = parent.linkedStudentId;
    const studentObjectId = student._id;
    const [results, timetables, exams, recordedClasses, teachers, controls, messages] = await Promise.all([
      Result.find({ studentId: { $in: [studentObjectId.toString(), student.studentId] } }).sort({ createdAt: -1 }),
      Timetable.find({
        $or: [
          { studentId: { $in: [studentObjectId.toString(), student.studentId] } },
          { batch: student.batch },
          { studentId: { $exists: false }, batch: { $exists: false } },
          { studentId: null, batch: null },
          { studentId: "", batch: "" },
        ],
      }).sort({ createdAt: -1 }),
      Exam.find().sort({ createdAt: -1 }),
      RecordedClass.find().sort({ createdAt: -1 }),
      User.find({ role: "teacher" }).select("-password").sort({ name: 1 }),
      ParentActivityControl.findOne({ parent: parent._id, student: studentObjectId }),
      ParentTeacherMessage.find({ parent: parent._id }).populate("teacher", "name email subject").sort({ createdAt: -1 }),
    ]);

    res.json({
      parent: normalizeParent(parent),
      student,
      results,
      timetables,
      exams,
      recordedClasses,
      teachers,
      controls: controls || null,
      messages,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load parent portal" });
  }
});

router.put("/controls", auth, async (req, res) => {
  try {
    if (req.user.role !== "parent") {
      return res.status(403).json({ message: "Parent access required" });
    }

    const parent = await User.findOne({ _id: req.user.id, role: "parent" });
    if (!parent) return res.status(404).json({ message: "Parent account not found" });
    if (!parent.linkedStudentId) return res.status(404).json({ message: "Linked student not found" });

    const controls = await ParentActivityControl.findOneAndUpdate(
      { parent: parent._id, student: parent.linkedStudentId },
      {
        dailyStudyGoalMinutes: req.body.dailyStudyGoalMinutes,
        maxPracticeTestsPerDay: req.body.maxPracticeTestsPerDay,
        allowRecordedClasses: req.body.allowRecordedClasses,
        allowPracticeExams: req.body.allowPracticeExams,
        allowWeekendStudy: req.body.allowWeekendStudy,
        focusSubjects: req.body.focusSubjects || [],
        notes: req.body.notes || "",
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.json(controls);
  } catch (err) {
    res.status(500).json({ message: "Failed to save activity controls" });
  }
});

router.post("/messages", auth, async (req, res) => {
  try {
    if (req.user.role !== "parent") {
      return res.status(403).json({ message: "Parent access required" });
    }

    const { teacherId, subject, message } = req.body;
    if (!teacherId || !subject || !message) {
      return res.status(400).json({ message: "Teacher, subject and message are required" });
    }

    const parent = await User.findOne({ _id: req.user.id, role: "parent" });
    const teacher = await User.findOne({ _id: teacherId, role: "teacher" });
    if (!parent) return res.status(404).json({ message: "Parent account not found" });
    if (!parent.linkedStudentId) return res.status(404).json({ message: "Linked student not found" });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    const saved = await ParentTeacherMessage.create({
      parent: parent._id,
      student: parent.linkedStudentId,
      teacher: teacher._id,
      subject,
      message,
    });

    await saved.populate("teacher", "name email subject");
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Failed to send message" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const parent = await User.findOne({ _id: req.params.id, role: "parent" });
    if (!parent) return res.status(404).json({ message: "Parent not found" });

    const { username, email, password, name, phone, studentId, relationship, status } = req.body;
    if (studentId) {
      const student = await findStudent(studentId);
      if (!student) return res.status(404).json({ message: "Linked student not found" });
      parent.linkedStudentId = student._id;
    }

    if (email && email !== parent.email) {
      const existing = await User.findOne({ email, role: "parent", _id: { $ne: parent._id } });
      if (existing) return res.status(400).json({ message: "Parent email already exists" });
      parent.email = email;
      parent.username = username || email;
    } else if (username && username !== parent.username) {
      const existing = await User.findOne({ username, role: "parent", _id: { $ne: parent._id } });
      if (existing) return res.status(400).json({ message: "Parent username already exists" });
      parent.username = username;
    }

    if (password) parent.password = await bcrypt.hash(password, 10);
    if (name !== undefined) parent.name = name;
    if (phone !== undefined) parent.phone = phone;
    if (relationship !== undefined) parent.relationship = relationship;
    if (status !== undefined) parent.status = status;

    const updated = await parent.save();
    await updated.populate("linkedStudentId");
    updated.password = undefined;
    res.json(normalizeParent(updated));
  } catch (err) {
    res.status(500).json({ message: "Failed to update parent" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await User.findOneAndDelete({ _id: req.params.id, role: "parent" });
    if (!deleted) return res.status(404).json({ message: "Parent not found" });
    await ParentActivityControl.deleteMany({ parent: req.params.id });
    res.json({ message: "Parent deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete parent" });
  }
});

module.exports = router;
