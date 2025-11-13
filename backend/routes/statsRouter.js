const express = require('express');
const router = express.Router();

// Import your models
const Student = require('../models/Student');
const Course = require('../models/Course');
const Exam = require('../models/Exam');

router.get('/', async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const activeCourses = await Course.countDocuments();
    const upcomingExams = await Exam.countDocuments({ date: { $gte: new Date() } });
    const thisMonthPerformance = "94%"; // Dummy value or calculate as needed

    res.json({ totalStudents, activeCourses, upcomingExams, thisMonthPerformance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
