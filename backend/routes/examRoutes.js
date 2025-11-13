const express = require("express");
const router = express.Router();
const Exam = require("../models/Exam");

// ⬇️ NEW: Cloudinary upload
const upload = require("../config/cloudinaryStorage");

// -------------------------------
// GET all exams
// -------------------------------
router.get("/", async (req, res) => {
  try {
    const exams = await Exam.find().sort({ createdAt: -1 });
    res.json(exams);
  } catch (err) {
    console.error("Error fetching exams:", err);
    res.status(500).json({ error: "Failed to fetch exams" });
  }
});

// -------------------------------
// CREATE new exam
// -------------------------------
router.post("/add", upload.single("pdf"), async (req, res) => {
 
  try {
    const { subject, title, date, targetType, targetValue} = req.body;
     console.log("REQ BODY →", req.body);
console.log("REQ FILE →", req.file);
console.log("REQ HEADERS →", req.headers["content-type"]);


    if (!req.file) {
      return res.status(400).json({ error: "PDF file is required" });
    }

    const newExam = new Exam({
      subject,
      title,
      date,
      targetType,
      targetValue,
      pdf: req.file.originalname, // display name
      pdfUrl: req.file.path,      // cloudinary URL path
      cloudinaryId: req.file.filename, // store this for delete later
    });

    await newExam.save();
    res.status(201).json({ message: "Exam created successfully", exam: newExam });
  } catch (err) {
    console.error("Error creating exam:", err);
    res.status(500).json({ error: "Failed to create exam" });
  }
});

// -------------------------------
// UPDATE exam
// -------------------------------
router.put("/:id", upload.single("pdf"), async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ error: "Exam not found" });

    const { subject, title, date } = req.body;

    // If new PDF uploaded → delete old one from Cloudinary
    if (req.file) {
      const cloudinary = require("../config/cloudinary");

      if (exam.cloudinaryId) {
        await cloudinary.uploader.destroy(exam.cloudinaryId, {
          resource_type: "raw",
        });
      }

      exam.pdf = req.file.originalname;
      exam.pdfUrl = req.file.path;
      exam.cloudinaryId = req.file.filename;
    }

    exam.subject = subject || exam.subject;
    exam.title = title || exam.title;
    exam.date = date || exam.date;

    await exam.save();
    res.json({ message: "Exam updated", exam });
  } catch (err) {
    console.error("Error updating exam:", err);
    res.status(500).json({ error: "Failed to update exam" });
  }
});

// -------------------------------
// DELETE exam
// -------------------------------
router.delete("/:id", async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ error: "Exam not found" });

    // Delete from Cloudinary
    const cloudinary = require("../config/cloudinary");
    if (exam.cloudinaryId) {
      await cloudinary.uploader.destroy(exam.cloudinaryId, {
        resource_type: "raw",
      });
    }

    await exam.deleteOne();
    res.json({ message: "Exam deleted" });
  } catch (err) {
    console.error("Error deleting exam:", err);
    res.status(500).json({ error: "Failed to delete exam" });
  }
});

module.exports = router;
