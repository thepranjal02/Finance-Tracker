const express = require("express");
const Transaction = require("../models/Transaction");
const auth = require("../middleware/auth");
const router = express.Router();

// Add Transaction
router.post("/", auth, async (req, res) => {
  const { amount, type, category, date } = req.body;
  try {
    const newTransaction = await Transaction.create({ userId: req.user, amount, type, category, date });
    res.json(newTransaction);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get Transactions
router.get("/", auth, async (req, res) => {
  const transactions = await Transaction.find({ userId: req.user }).sort({ createdAt: -1 });
  res.json(transactions);
});

// Delete Transaction
router.delete("/:id", auth, async (req, res) => {
  await Transaction.findByIdAndDelete(req.params.id);
  res.json({ msg: "Transaction deleted" });
});

module.exports = router;
