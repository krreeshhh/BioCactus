const express = require('express');
const router = express.Router();
const { db } = require('../services/firebase.service');
const { verifyToken } = require('../middleware/auth.middleware');

// POST /api/user/feedback
router.post('/', verifyToken, async (req, res) => {
    try {
        const { uid, email, name } = req.user;
        const { type, message, rating } = req.body;

        if (!message || !type) {
            return res.status(400).json({
                success: false,
                message: 'Feedback type and message are required'
            });
        }

        const feedbackData = {
            userId: uid,
            userEmail: email,
            userName: name || 'Explorer',
            type,
            message,
            rating: rating || 0,
            status: 'new',
            createdAt: new Date().toISOString()
        };

        await db.collection('feedback').add(feedbackData);

        res.status(200).json({
            success: true,
            message: 'Feedback submitted successfully! Thank you for helping BioCactus grow.'
        });
    } catch (error) {
        console.error('Feedback submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while submitting feedback'
        });
    }
});

module.exports = router;
