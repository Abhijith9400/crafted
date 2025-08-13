const express = require("express");
const bcrypt = require("bcryptjs");
const Student = require("../models/Student");

const router = express.Router();

// ================= GET ALL STUDENTS =================
router.get("/", async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 }).select("-password");
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= GET SINGLE STUDENT BY ID =================
router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select("-password");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= ADD NEW STUDENT =================
router.post("/", async (req, res) => {
  try {
    const { studentId, password, name, email, phone, course, status } = req.body;

    if (!studentId || !password || !name || !email || !course) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const existingEmail = await Student.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const existingId = await Student.findOne({ studentId });
    if (existingId) {
      return res.status(400).json({ message: "Student ID already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = new Student({
      studentId,
      password: hashedPassword,
      name,
      email,
      phone,
      course,
      status,
    });

    await newStudent.save();
    res.status(201).json({ message: "Student added successfully", student: newStudent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= EDIT STUDENT =================
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let { password, email, studentId } = req.body;

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (email && email !== student.email) {
      const existingEmail = await Student.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    if (studentId && studentId !== student.studentId) {
      const existingId = await Student.findOne({ studentId });
      if (existingId) {
        return res.status(400).json({ message: "Student ID already exists" });
      }
    }

    if (password) {
      password = await bcrypt.hash(password, 10);
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { ...req.body, ...(password && { password }) },
      { new: true }
    ).select("-password");

    res.json({ message: "Student updated successfully", student: updatedStudent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= DELETE STUDENT =================
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= STUDENT LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { studentId, password } = req.body;

    if (!studentId || !password) {
      return res.status(400).json({ message: "Please provide ID and password" });
    }

    const student = await Student.findOne({ studentId });
    if (!student) {
      return res.status(404).json({ message: "Invalid student ID or password" });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid student ID or password" });
    }

    // Send student details (without password)
    res.json({
      message: "Login successful",
      student: {
        _id: student._id,
        studentId: student.studentId,
        name: student.name,
        email: student.email,
        phone: student.phone,
        course: student.course,
        status: student.status,
        createdAt: student.createdAt,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
