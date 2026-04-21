const express = require('express');
const router = express.Router();
const RecordedClass = require('../models/RecordedClass');

// GET all recorded classes
router.get('/', async (req, res) => {
  try {
    const classes = await RecordedClass.find().sort({ createdAt: -1 });
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recorded classes' });
  }
});

// POST new recorded class
router.post('/', async (req, res) => {
  try {
    const { title, description, youtube_id, course_id } = req.body;
    
    if (!title || !youtube_id) {
      return res.status(400).json({ error: 'Title and YouTube ID are required' });
    }

    const newClass = new RecordedClass({
      title,
      description,
      youtube_id,
      course_id: course_id || null,
    });

    const savedClass = await newClass.save();
    res.status(201).json(savedClass);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create recorded class' });
  }
});

// DELETE recorded class
router.delete('/:id', async (req, res) => {
  try {
    const deletedClass = await RecordedClass.findByIdAndDelete(req.params.id);
    if (!deletedClass) {
      return res.status(404).json({ error: 'Recorded class not found' });
    }
    res.json({ message: 'Recorded class deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete recorded class' });
  }
});

// UPDATE recorded class
router.put('/:id', async (req, res) => {
  try {
    const { title, description, youtube_id, course_id } = req.body;
    const updatedClass = await RecordedClass.findByIdAndUpdate(
      req.params.id,
      { title, description, youtube_id, course_id },
      { new: true }
    );
    if (!updatedClass) {
      return res.status(404).json({ error: 'Recorded class not found' });
    }
    res.json(updatedClass);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update recorded class' });
  }
});

module.exports = router;
