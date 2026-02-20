const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { verifyToken } = require('../middleware/auth.middleware');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const SYSTEM_PROMPT = `You are BioCactus AI — the friendly, expert assistant for the BioCactus learning platform.

BioCactus is an AI-powered biotech and biology e-learning platform where students:
- Learn through AI-generated lessons on topics like DNA, RNA, CRISPR, Cell Biology, Genetics, and Proteins.
- Take quizzes and earn XP (experience points) to level up.
- Maintain daily streaks and track progress on a leaderboard.
- Have a visual cactus mascot companion.

Your role:
1. Answer any questions about how the BioCactus platform works (navigation, XP, streaks, hearts, quizzes, lessons, leaderboard, profile).
2. Answer any biology / biotech / life-science questions clearly and accurately — DNA, RNA, CRISPR, genetics, cell biology, proteins, enzymes, evolution, ecology, microbiology, and more.
3. Keep answers friendly, concise, and educational. Use bullet points when listing facts.
4. If a question is totally unrelated to biology or the platform, politely redirect back to your areas of expertise.
5. You can use markdown formatting (bold, bullets, code for DNA sequences) in your replies.

Always be encouraging — you're a learning companion, not just an information bot!`;

// POST /api/chat
router.post('/', verifyToken, async (req, res) => {
    const { message, history = [] } = req.body;
    const { languageName } = req;

    if (!message || typeof message !== 'string') {
        return res.status(400).json({ success: false, message: 'Message is required.' });
    }

    try {
        const chat = model.startChat({
            history: [
                {
                    role: 'user',
                    parts: [{ text: `${SYSTEM_PROMPT}\n\nCRITICAL: Respond STRICTLY in ${languageName} using native script.` }],
                },
                {
                    role: 'model',
                    parts: [{ text: `Understood! I will communicate strictly in ${languageName}.` }],
                },
                // Inject prior conversation turns
                ...history.map(msg => ({
                    role: msg.role === 'assistant' ? 'model' : 'user',
                    parts: [{ text: msg.content }],
                })),
            ],
            generationConfig: {
                maxOutputTokens: 800,
                temperature: 0.7,
            },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({
            success: true,
            language: req.language,
            data: { reply: text },
        });
    } catch (error) {
        console.error('Chat error:', error.message);
        res.status(500).json({
            success: false,
            message: 'BioCactus AI is resting. Try again in a moment!',
        });
    }
});

module.exports = router;
