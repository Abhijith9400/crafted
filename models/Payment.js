const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["paid", "pending", "overdue"], default: "pending" },
  dueDate: { type: Date, required: true },
  paidAt: { type: Date },
  classGrade: { type: String },
  batch: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Payment", PaymentSchema);
