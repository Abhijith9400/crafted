// routes/course.js
const express = require("express");
const Course = require("../models/Course");
const router = express.Router();

// 📌 Get all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 📌 Create course
router.post("/", async (req, res) => {
  try {
    const { name, description, duration, color, videoUrl } = req.body;
    if (!name || !description || !duration) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }
    const newCourse = new Course({
      name,
      description,
      duration,
      color,
      videoUrl
    });
    await newCourse.save();
    res.status(201).json({ message: "Course created", course: newCourse });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 📌 Update course
router.patch("/:id", async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course updated", course: updated });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 📌 Delete course
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
