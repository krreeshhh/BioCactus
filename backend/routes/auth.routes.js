const express = require('express');
const router = express.Router();
const { db } = require('../services/firebase.service');
const { verifyToken } = require('../middleware/auth.middleware');

// POST /api/auth/login
router.post('/login', verifyToken, async (req, res) => {
    try {
        const { uid, email, name, picture } = req.user;
        const userRef = db.collection('users').doc(uid);
        const doc = await userRef.get();

        let userData;
        if (!doc.exists) {
            userData = {
                email,
                name: name || 'User',
                photoURL: picture || '',
                xp: 0,
                level: 0,
                streak: 0,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            };
            await userRef.set(userData);
        } else {
            userData = doc.data();
            userData.lastLogin = new Date().toISOString();
            await userRef.update({ lastLogin: userData.lastLogin });
        }

        res.status(200).json({
            success: true,
            data: userData,
            message: 'User logged in and synced successfully'
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during login'
        });
    }
});

module.exports = router;
