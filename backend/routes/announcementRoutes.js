const express = require("express");
const router = express.Router();
const Announcement = require("../models/Announcement");

// Get all announcements
router.get("/", async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Create announcement
router.post("/", async (req, res) => {
  try {
    const { title, content, priority } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content required" });
    }
    const announcement = new Announcement({ title, content, priority });
    await announcement.save();
    res.status(201).json(announcement);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update announcement
router.put("/:id", async (req, res) => {
  try {
    const { title, content, priority } = req.body;
    const updated = await Announcement.findByIdAndUpdate(
      req.params.id,
      { title, content, priority },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Delete announcement
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Announcement.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
