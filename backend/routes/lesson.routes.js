const express = require('express');
const router = express.Router();
const { db } = require('../services/firebase.service');
const { generateLesson } = require('../services/gemini.service');
const { XP_RULES } = require('../services/xp.service');
const { verifyToken } = require('../middleware/auth.middleware');
const { calculateStreak } = require('../services/streak.service');

// GET /api/lesson/:topicId
router.get('/:topicId', verifyToken, async (req, res) => {
    try {
        const { topicId } = req.params;
        const { uid } = req.user;

        // Fetch User Data first
        const userRef = db.collection('users').doc(uid);
        const userDoc = await userRef.get();
        const userData = userDoc.data();

        if (!userData) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Find topic (Global or Custom)
        let topicData;
        const topicRef = db.collection('topics').doc(topicId);
        const topicDoc = await topicRef.get();

        if (topicDoc.exists) {
            topicData = topicDoc.data();
        } else if (userData.customCurriculum) {
            topicData = userData.customCurriculum.find(t => t.id === topicId);
        }

        if (!topicData) {
            return res.status(404).json({
                success: false,
                message: 'Topic not found'
            });
        }

        const userPrefs = {
            experience: userData.experience,
            topics: userData.interestTopic || userData.topics
        };

        const lessonContent = await generateLesson(topicData.title, userPrefs);

        // Save/Update progress
        const progressRef = db.collection('progress').doc(`${uid}_${topicId}`);
        const progressDoc = await progressRef.get();

        if (!progressDoc.exists) {
            await progressRef.set({
                userId: uid,
                topicId: topicId,
                completedLessons: [topicId],
                quizScores: [],
                lastAccessed: new Date().toISOString(),
                completionPercentage: 0
            });
        } else {
            const data = progressDoc.data();
            const completedLessons = data.completedLessons || [];
            if (!completedLessons.includes(topicId)) {
                completedLessons.push(topicId);
            }
            await progressRef.update({
                completedLessons,
                lastAccessed: new Date().toISOString()
            });
        }

        // Award XP + update streak
        const { newStreak, lastActivityDate } = calculateStreak(userData);
        const newXP = (userData.xp || 0) + XP_RULES.COMPLETE_LESSON;
        await userRef.update({
            xp: newXP,
            level: Math.floor(newXP / 100),
            streak: newStreak,
            lastActivityDate
        });

        // Fetch updated progress to return to frontend
        const updatedProgressDoc = await progressRef.get();
        const progressData = updatedProgressDoc.data();

        res.status(200).json({
            success: true,
            data: {
                content: lessonContent,
                topic: {
                    ...topicData,
                    ...progressData,
                    id: topicId
                }
            },
            message: 'Lesson generated successfully'
        });
    } catch (error) {
        console.error('Lesson generation error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error generating lesson'
        });
    }
});

module.exports = router;
