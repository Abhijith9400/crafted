const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Exam = require("../models/Exam");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files are allowed"), false);
  },
});

// ✅ GET all exams
router.get("/", async (req, res) => {
  try {
    const exams = await Exam.find().sort({ createdAt: -1 });
    res.json(exams);
  } catch (err) {
    console.error("Error fetching exams:", err);
    res.status(500).json({ error: "Failed to fetch exams" });
  }
});

// ✅ POST create new exam
router.post("/add", upload.single("pdf"), async (req, res) => {
  try {
    console.log("BODY ON /exams/add →", req.body);   // 👈 ADD THIS LINE

    const { subject, title, date, targetType, targetValue } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "PDF file is required" });
    }

    const newExam = new Exam({
      subject,
      title,
      date,
      pdf: req.file.filename,
      targetType,
      targetValue,
    });

    await newExam.save();
    res.status(201).json({ message: "Exam created successfully", exam: newExam });
  } catch (err) {
    console.error("Error creating exam:", err);
    res.status(500).json({ error: "Failed to create exam" });
  }
});


// ✅ PUT update exam
router.put("/:id", upload.single("pdf"), async (req, res) => {
  try {
    const { subject, title, date } = req.body;
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ error: "Exam not found" });

    // Delete old file if new one is uploaded
    if (req.file && exam.pdf) {
      const oldFilePath = path.join(uploadDir, exam.pdf);
      if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
      exam.pdf = req.file.filename;
    }

    exam.subject = subject || exam.subject;
    exam.title = title || exam.title;
    exam.date = date || exam.date;
    exam.targetType = targetType || exam.targetType;
    exam.targetValue = targetValue || exam.targetValue;

    await exam.save();
    res.json({ message: "Exam updated", exam });
  } catch (err) {
    console.error("Error updating exam:", err);
    res.status(500).json({ error: "Failed to update exam" });
  }
});

// ✅ DELETE exam
router.delete("/:id", async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ error: "Exam not found" });

    // Delete PDF file
    const filePath = path.join(uploadDir, exam.pdf);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await exam.deleteOne();
    res.json({ message: "Exam deleted" });
  } catch (err) {
    console.error("Error deleting exam:", err);
    res.status(500).json({ error: "Failed to delete exam" });
  }
});

module.exports = router;
