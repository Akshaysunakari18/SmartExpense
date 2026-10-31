const express = require("express");
const router = express.Router();

const Transaction = require("../models/Transaction");

// 1. Get all transactions
router.get("/", async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: transactions.length,
            data: transactions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// 2. Add a new transaction
router.post("/", async (req, res) => {
    try {
        const { title, amount, type, category, description, date } = req.body;

        const transaction = await Transaction.create({
            title,
            amount,
            type,
            category,
            description,
            date
        });

        res.status(201).json({
            success: true,
            message: "Transaction added successfully!",
            data: transaction
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// 3. Delete a transaction
router.delete("/:id", async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndDelete(req.params.id);

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Transaction deleted successfully!"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid transaction ID"
        });
    }
});

module.exports = router;