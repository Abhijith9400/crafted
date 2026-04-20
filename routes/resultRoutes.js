const express = require('express');
const Result = require('../models/Result'); // Mongoose model
const router = express.Router();

// CREATE: Add a new result
router.post('/add', async (req, res) => {
  try {
    const { studentId, subject, examType, score, maxScore, grade, date, trend } = req.body;

    if (!studentId || !subject || !examType || score == null || maxScore == null) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newResult = new Result({ studentId, subject, examType, score, maxScore, grade, date, trend });
    await newResult.save();

    res.status(201).json({ message: 'Result added successfully', result: newResult });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// READ: Get all results
router.get('/', async (req, res) => {
  try {
    const results = await Result.find();
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET: Get results for a specific student
router.get('/student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const results = await Result.find({ studentId }); // <-- filter by studentId
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



// UPDATE: Edit a result by ID
router.put('/edit/:id', async (req, res) => {
  try {
    const { studentId, subject, examType, score, maxScore, grade, date, trend } = req.body;

    const updatedResult = await Result.findByIdAndUpdate(
      req.params.id,
      { studentId, subject, examType, score, maxScore, grade, date, trend },
      { new: true, runValidators: true }
    );

    if (!updatedResult) return res.status(404).json({ message: 'Result not found' });

    res.json({ message: 'Result updated successfully', result: updatedResult });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE: Remove a result by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const deletedResult = await Result.findByIdAndDelete(req.params.id);
    if (!deletedResult) return res.status(404).json({ message: 'Result not found' });

    res.json({ message: 'Result deleted successfully', result: deletedResult });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
