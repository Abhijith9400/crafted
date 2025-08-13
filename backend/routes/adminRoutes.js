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
});

module.exports = router;
