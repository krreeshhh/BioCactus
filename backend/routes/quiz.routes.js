const express = require('express');
const router = express.Router();
const { db } = require('../services/firebase.service');
const { generateQuiz, generateFeedback } = require('../services/gemini.service');
const { XP_RULES, calculateLevel } = require('../services/xp.service');
const { verifyToken } = require('../middleware/auth.middleware');
const { calculateStreak } = require('../services/streak.service');

// GET /api/quiz/:topicId
router.get('/:topicId', verifyToken, async (req, res) => {
    try {
        const { topicId } = req.params;
        const { uid } = req.user;
        const { language, languageName } = req;

        // Fetch User Data
        const userRef = db.collection('users').doc(uid);
        const userDoc = await userRef.get();
        const userData = userDoc.data();

        if (!userData) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Find topic
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

        // Cache-check: translatedQuizzes
        let questions;
        const cacheId = `${topicId}_${language}`;
        const cacheRef = db.collection('translatedQuizzes').doc(cacheId);
        const cacheDoc = await cacheRef.get();

        if (cacheDoc.exists) {
            questions = cacheDoc.data().quiz;
        } else {
            const userPrefs = { experience: userData?.experience };
            questions = await generateQuiz(topicData.title, userPrefs, languageName);
            // Save to cache if we got actual questions
            if (questions && questions.length > 0) {
                await cacheRef.set({
                    topicId,
                    language,
                    quiz: questions,
                    createdAt: new Date().toISOString()
                });
            }
        }

        res.status(200).json({
            success: true,
            language,
            data: { questions },
            message: 'Quiz generated successfully'
        });
    } catch (error) {
        console.error('Quiz generation error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error generating quiz'
        });
    }
});

// POST /api/quiz/submit
router.post('/submit', verifyToken, async (req, res) => {
    try {
        const { topicId, answers, questions } = req.body;
        const { uid } = req.user;
        const { language, languageName } = req;

        let score = 0;
        questions.forEach((q, index) => {
            if (answers[index] === q.correctAnswer) {
                score += 1;
            }
        });

        const passed = (score / questions.length) >= 0.5;
        const xpGained = score * XP_RULES.CORRECT_ANSWER;

        const userRef = db.collection('users').doc(uid);
        const userDoc = await userRef.get();
        const userData = userDoc.data();
        const userPrefs = { experience: userData?.experience };

        // Generate feedback in target language
        const feedback = await generateFeedback(score, questions.length, userPrefs, languageName);

        const currentHearts = userData.hearts ?? 5;
        let newHearts = currentHearts;

        if (!passed && currentHearts > 0) {
            newHearts -= 1;
        }

        const newXP = (userData.xp || 0) + xpGained;
        const newLevel = calculateLevel(newXP);

        // Only update streak when quiz is passed
        const streakUpdate = {};
        if (passed) {
            const { newStreak, lastActivityDate } = calculateStreak(userData);
            streakUpdate.streak = newStreak;
            streakUpdate.lastActivityDate = lastActivityDate;
        }

        await userRef.update({
            xp: newXP,
            level: newLevel,
            hearts: newHearts,
            ...streakUpdate
        });

        const { lessonIndex } = req.body;
        const progressRef = db.collection('progress').doc(`${uid}_${topicId}`);
        const progressDoc = await progressRef.get();

        if (progressDoc.exists) {
            const data = progressDoc.data();
            const quizScores = data.quizScores || [];
            const completedLessons = data.completedLessons || [];

            quizScores.push({
                score,
                total: questions.length,
                passed,
                lessonIndex,
                timestamp: new Date().toISOString()
            });

            // If they passed, ensure this specific lesson is marked done
            const lessonKey = lessonIndex ? `lesson_${lessonIndex}` : topicId;
            if (passed && !completedLessons.includes(lessonKey)) {
                completedLessons.push(lessonKey);
            }

            // Calculate percentage based on total lessons in the module
            let totalLessons = 5;
            const topicRef = db.collection('topics').doc(topicId);
            const topicDoc = await topicRef.get();
            if (topicDoc.exists) {
                totalLessons = topicDoc.data().lessonsCount || topicDoc.data().lessons || 5;
            } else if (userData.customCurriculum) {
                const customTopic = userData.customCurriculum.find(t => t.id === topicId);
                if (customTopic) {
                    totalLessons = customTopic.lessonsCount || customTopic.lessons || 5;
                }
            }

            const completionPercentage = Math.round((completedLessons.length / totalLessons) * 100);

            await progressRef.update({
                quizScores,
                completedLessons,
                completionPercentage
            });
        }

        res.status(200).json({
            success: true,
            language,
            data: {
                score,
                total: questions.length,
                passed,
                xpGained,
                level: newLevel,
                feedback
            },
            message: passed ? 'Quiz passed!' : 'Quiz failed. Try again to unlock the next level.'
        });
    } catch (error) {
        console.error('Quiz submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error submitting quiz'
        });
    }
});

module.exports = router;
