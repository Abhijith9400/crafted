// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");       // For admin login
const Student = require("../models/Student"); // ✅ For student login
const router = express.Router();

// ================= ADMIN LOGIN =================
router.post("/admin-login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username, role: "admin" });
        if (!user) return res.status(400).json({ msg: "Admin not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id, role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({ token, role: user.role });
    } catch (err) {
        console.error("Admin login error:", err);
        res.status(500).send("Server error");
    }
});

// ================= STUDENT LOGIN =================
router.post("/student-login", async (req, res) => {
    const { studentId, password } = req.body;
    try {
        // ✅ Find in Student collection
        const student = await Student.findOne({ studentId });
        if (!student) return res.status(400).json({ msg: "Student not found" });

        // Compare password
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        // Create JWT token
        const token = jwt.sign(
            { id: student._id, role: "student" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            token,
            role: "student",
            student: {
                id: student._id,
                studentId: student.studentId,
                name: student.name,
                email: student.email,
                course: student.course,
                status: student.status
            }
        });
    } catch (err) {
        console.error("Student login error:", err);
        res.status(500).send("Server error");
    }
});

module.exports = router;
