// backend/routes/exams.js
const express = require("express");
const router = express.Router();
const Exam = require("../models/Exam");
const upload = require("../config/cloudinaryStorage"); // multer-storage-cloudinary
const cloudinary = require("../config/cloudinary");

// GET all exams
router.get("/", async (req, res) => {
  try {
    const exams = await Exam.find().sort({ createdAt: -1 });
    res.json(exams);
  } catch (err) {
    console.error("Error fetching exams:", err);
    res.status(500).json({ error: "Failed to fetch exams" });
  }
});

// CREATE new exam
router.post("/add", upload.single("pdf"), async (req, res) => {
  console.log("🔥 POST /exams/add");
  console.log("BODY →", req.body);
  console.log("FILE →", req.file && { path: req.file.path, filename: req.file.filename });

  try {
    const { subject, title, date, targetType, targetValue } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "PDF file is required" });
    }

    const newExam = new Exam({
      subject,
      title,
      date,
      targetType,
      targetValue,
      pdf: req.file.originalname || req.file.filename,
      pdfUrl: req.file.path,      // cloudinary URL
      cloudinaryId: req.file.filename, // cloudinary public id
    });

    await newExam.save();
    res.status(201).json({ message: "Exam created successfully", exam: newExam });
  } catch (err) {
    console.error("Error creating exam:", err);
    res.status(500).json({ error: "Failed to create exam" });
  }
});

// UPDATE exam
router.put("/:id", upload.single("pdf"), async (req, res) => {
  console.log("🔥 PUT /exams/:id", req.params.id);
  console.log("BODY →", req.body);
  console.log("FILE →", req.file && { path: req.file.path, filename: req.file.filename });

  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ error: "Exam not found" });

    const { subject, title, date, targetType, targetValue } = req.body;

    // If new PDF uploaded → delete old one from Cloudinary
    if (req.file) {
      if (exam.cloudinaryId) {
        try {
          await cloudinary.uploader.destroy(exam.cloudinaryId, { resource_type: "raw" });
        } catch (e) {
          console.warn("Cloudinary delete warning:", e.message || e);
        }
      }

      exam.pdf = req.file.originalname || req.file.filename;
      exam.pdfUrl = req.file.path;
      exam.cloudinaryId = req.file.filename;
    }

    // update fields
    exam.subject = subject ?? exam.subject;
    exam.title = title ?? exam.title;
    exam.date = date ?? exam.date;
    exam.targetType = targetType ?? exam.targetType;
    exam.targetValue = targetValue ?? exam.targetValue;

    await exam.save();
    res.json({ message: "Exam updated", exam });
  } catch (err) {
    console.error("Error updating exam:", err);
    res.status(500).json({ error: "Failed to update exam" });
  }
});

// DELETE exam
router.delete("/:id", async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ error: "Exam not found" });

    if (exam.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(exam.cloudinaryId, { resource_type: "raw" });
      } catch (e) {
        console.warn("Cloudinary delete warning:", e.message || e);
      }
    }

    await exam.deleteOne();
    res.json({ message: "Exam deleted" });
  } catch (err) {
    console.error("Error deleting exam:", err);
    res.status(500).json({ error: "Failed to delete exam" });
  }
});

module.exports = router;
