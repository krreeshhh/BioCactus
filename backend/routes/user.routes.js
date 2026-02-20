const express = require('express');
const router = express.Router();
const { db } = require('../services/firebase.service');
const { verifyToken } = require('../middleware/auth.middleware');
const { generateCurriculum } = require('../services/gemini.service');

// GET /api/user
router.get('/', verifyToken, async (req, res) => {
    try {
        const { uid } = req.user;
        const userRef = db.collection('users').doc(uid);
        const doc = await userRef.get();

        if (!doc.exists) {
            return res.status(404).json({
                success: false,
                message: 'User profile not found'
            });
        }

        // Get progress as well
        const progressSnapshot = await db.collection('progress')
            .where('userId', '==', uid)
            .get();

        const progress = progressSnapshot.docs.map(doc => doc.data());

        const userData = doc.data();
        res.status(200).json({
            success: true,
            data: {
                ...userData,
                progress,
                hearts: userData.hearts ?? 5 // Fallback to 5
            },
            message: 'User profile retrieved'
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error retrieving profile'
        });
    }
});

// GET /api/user/leaderboard
router.get('/leaderboard', verifyToken, async (req, res) => {
    try {
        const usersSnapshot = await db.collection('users')
            .orderBy('xp', 'desc')
            .limit(10)
            .get();

        const leaderboard = usersSnapshot.docs.map((doc, index) => {
            const data = doc.data();
            return {
                name: data.displayName || "Anonymous",
                xp: data.xp || 0,
                avatar: data.photoURL || "👤",
                isUser: data.uid === req.user.uid,
                rank: index + 1
            };
        });

        res.status(200).json({
            success: true,
            data: leaderboard,
            message: 'Leaderboard retrieved'
        });
    } catch (error) {
        console.error('Leaderboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error retrieving leaderboard'
        });
    }
});

// POST /api/user/curriculum
router.post('/curriculum', verifyToken, async (req, res) => {
    try {
        const { uid } = req.user;
        const { experience, topics: interest } = req.body;

        console.log(`Generating custom curriculum for user ${uid}...`);
        const curriculum = await generateCurriculum(experience, interest);

        const userRef = db.collection('users').doc(uid);
        await userRef.update({
            customCurriculum: curriculum,
            experience,
            interestTopic: interest,
            onboardingCompleted: true
        });

        res.status(200).json({
            success: true,
            data: curriculum,
            message: 'Custom curriculum generated and saved'
        });
    } catch (error) {
        console.error('Curriculum generation error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error generating curriculum'
        });
    }
});

module.exports = router;
