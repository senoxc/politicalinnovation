const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

// Get pending applications
router.get('/pending', async (req, res) => {
    try {
        const users = await User.find({ approved: false });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch pending users' });
    }
});

// Approve user
router.post('/approve', async (req, res) => {
    const { userId } = req.body;
    try {
        const user = await User.findById(userId);
        user.approved = true;
        await user.save();
        res.json({ message: 'User approved' });
    } catch (error) {
        res.status(500).json({ error: 'Approval failed' });
    }
});

module.exports = router;
