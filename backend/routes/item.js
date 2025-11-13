const express = require("express");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

let items = [];

// Create Item
router.post("/", auth, (req, res) => {
    const newItem = { id: Date.now(), name: req.body.name };
    items.push(newItem);
    res.json(newItem);
});

// Get All Items
router.get("/", auth, (req, res) => {
    res.json(items);
});

// Delete Item
router.delete("/:id", auth, (req, res) => {
    items = items.filter((item) => item.id != req.params.id);
    res.json({ msg: "Item deleted" });
});

module.exports = router;
