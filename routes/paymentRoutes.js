const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");

// Get all payments
router.get("/", async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch payments" });
  }
});

// Create new payment record
router.post("/", async (req, res) => {
  try {
    const { studentId, studentName, amount, status, dueDate, classGrade, batch } = req.body;
    const payment = new Payment({
      studentId,
      studentName,
      amount,
      status: status || "pending",
      dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // default 7 days from now
      classGrade,
      batch
    });
    const saved = await payment.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "Failed to create payment" });
  }
});

// Update payment record (e.g. mark as paid)
router.put("/:id", async (req, res) => {
  try {
    const { status, paidAt } = req.body;
    const updateData = { status };
    if (status === "paid") {
      updateData.paidAt = paidAt || new Date();
    }
    const updated = await Payment.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update payment" });
  }
});

// Delete payment record
router.delete("/:id", async (req, res) => {
  try {
    await Payment.findByIdAndDelete(req.params.id);
    res.json({ message: "Payment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete payment" });
  }
});

module.exports = router;
