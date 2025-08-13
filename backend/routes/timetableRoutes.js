const express = require("express");
const router = express.Router();
const Timetable = require("../models/Timetable");

// Create
router.post("/", async (req, res) => {
  try {
    const newEntry = new Timetable(req.body);
    const saved = await newEntry.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "Error creating entry" });
  }
});

// Read all
router.get("/", async (req, res) => {
  try {
    const allEntries = await Timetable.find();
    res.json(allEntries);
  } catch (err) {
    res.status(500).json({ error: "Error fetching timetable" });
  }
});

// Update
router.put("/:id", async (req, res) => {
  try {
    const updated = await Timetable.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Error updating entry" });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    await Timetable.findByIdAndDelete(req.params.id);
    res.json({ message: "Entry deleted" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting entry" });
  }
});

module.exports = router;
