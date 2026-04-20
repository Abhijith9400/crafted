const express = require('express');
const router = express.Router();
const AdminProfile = require('../models/AdminProfile');

// GET admin profile (assuming only one)
router.get('/', async (req, res) => {
  try {
    const profile = await AdminProfile.findOne(); // Only one admin assumed
    if (!profile) {
      return res.status(404).json({ message: 'Admin profile not found' });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admin profile' });
  }
});

// UPDATE admin profile
router.put('/:id', async (req, res) => {
  try {
    const updatedProfile = await AdminProfile.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProfile) {
      return res.status(404).json({ message: 'Admin profile not found' });
    }
    res.json(updatedProfile);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update admin profile' });
  }
});

// (Optional) POST: Create new admin profile
router.post('/', async (req, res) => {
  try {
    const newProfile = new AdminProfile(req.body);
    const saved = await newProfile.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create admin profile' });
  }
});const User = require('../models/User');
const bcrypt = require('bcryptjs');

// ================= TEACHER MANAGEMENT =================

router.get('/teachers', async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' }).select('-password');
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch teachers' });
  }
});

router.post('/teachers', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const existing = await User.findOne({ username: email, role: 'teacher' });
    if (existing) {
      return res.status(400).json({ error: 'Teacher with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newTeacher = new User({
      username: email,
      email,
      name,
      password: hashedPassword,
      role: 'teacher'
    });
    const saved = await newTeacher.save();
    saved.password = undefined;
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create teacher' });
  }
});

router.patch('/teachers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let { name, email, password } = req.body;
    const teacher = await User.findById(id);
    if (!teacher || teacher.role !== 'teacher') {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    
    if (email && email !== teacher.email) {
      const existing = await User.findOne({ username: email, role: 'teacher' });
      if (existing) {
        return res.status(400).json({ error: 'Teacher with this email already exists' });
      }
      teacher.email = email;
      teacher.username = email;
    }
    if (name) teacher.name = name;
    if (password) {
      teacher.password = await bcrypt.hash(password, 10);
    }
    
    const updated = await teacher.save();
    updated.password = undefined;
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update teacher' });
  }
});

router.delete('/teachers/:id', async (req, res) => {
  try {
    const deleted = await User.findOneAndDelete({ _id: req.params.id, role: 'teacher' });
    if (!deleted) return res.status(404).json({ error: 'Teacher not found' });
    res.json({ message: 'Teacher deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete teacher' });
  }
});

module.exports = router;
