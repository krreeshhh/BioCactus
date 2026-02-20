const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const lessonRoutes = require('./routes/lesson.routes');
const quizRoutes = require('./routes/quiz.routes');
const progressRoutes = require('./routes/progress.routes');
const chatRoutes = require('./routes/chat.routes');
const { languageMiddleware } = require('./middleware/language.middleware');

const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(languageMiddleware);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/lesson', lessonRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/chat', chatRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../dist')));

    app.get('*', (req, res) => {
        if (!req.path.startsWith('/api')) {
            res.sendFile(path.join(__dirname, '../dist/index.html'));
        }
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
