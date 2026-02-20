const express = require('express');
const router = express.Router();
const { db } = require('../services/firebase.service');
const { verifyToken } = require('../middleware/auth.middleware');

// GET /api/progress
router.get('/', verifyToken, async (req, res) => {
    try {
        const { uid } = req.user;

        // Fetch user info
        const userDoc = await db.collection('users').doc(uid).get();
        const userData = userDoc.data();

        // Determine available topics (Custom vs Global)
        let topics = [];
        if (userData.customCurriculum && userData.customCurriculum.length > 0) {
            topics = userData.customCurriculum;
        } else {
            const topicsSnapshot = await db.collection('topics').orderBy('order').get();
            topics = topicsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }

        // Fetch user progress
        const progressSnapshot = await db.collection('progress')
            .where('userId', '==', uid)
            .get();

        const progressMap = {};
        progressSnapshot.docs.forEach(doc => {
            const data = doc.data();
            progressMap[data.topicId] = data;
        });

        const detailedProgress = topics.map(topic => {
            const prog = progressMap[topic.id] || {
                completedLessons: [],
                quizScores: [],
                completionPercentage: 0
            };
            return {
                ...topic,
                topicId: topic.id,
                ...prog
            };
        });

        // Calculate overall completion
        const completedTopicsCount = detailedProgress.filter(p => p.completionPercentage >= 100).length;
        const overallCompletion = topics.length > 0 ? (completedTopicsCount / topics.length) * 100 : 0;

        res.status(200).json({
            success: true,
            data: {
                topics: detailedProgress,
                overallCompletion,
                xp: userData.xp || 0,
                level: userData.level || 1,
                streak: userData.streak || 0,
                hearts: userData.hearts ?? 5,
                lastActivityDate: userData.lastActivityDate || null
            },
            message: 'Progress retrieved successfully'
        });
    } catch (error) {
        console.error('Progress retrieval error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error retrieving progress'
        });
    }
});

module.exports = router;
