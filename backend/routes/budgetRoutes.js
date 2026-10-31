
const express = require("express");
const router = express.Router();

const Budget = require("../models/Budget");

// 1. Get all budgets or budgets for a selected month
router.get("/", async (req, res) => {
    try {
        const { month } = req.query;

        const filter = month ? { month } : {};

        const budgets = await Budget.find(filter);

        res.status(200).json({
            success: true,
            count: budgets.length,
            data: budgets
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// 2. Add or update a monthly budget
router.post("/", async (req, res) => {
    try {
        const { category, amount, month } = req.body;

        if (!category || !amount || !month || Number(amount) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid category, amount, and month."
            });
        }

        const budget = await Budget.findOneAndUpdate(
            {
                category: category,
                month: month
            },
            {
                category: category,
                amount: Number(amount),
                month: month
            },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            message: "Budget saved successfully!",
            data: budget
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// 3. Delete a budget
router.delete("/:id", async (req, res) => {
    try {
        const budget = await Budget.findByIdAndDelete(req.params.id);

        if (!budget) {
            return res.status(404).json({
                success: false,
                message: "Budget not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Budget deleted successfully!"
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid budget ID"
        });
    }
});

module.exports = router;
