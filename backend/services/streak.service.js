/**
 * Streak Service
 * 
 * Rules:
 * - Streak only increments when a lesson is completed OR a quiz is passed.
 * - Streak increments at most once per calendar day.
 * - If more than 1 day has passed since last activity, streak resets to 1.
 */

const getDateString = (date = new Date()) => date.toISOString().split('T')[0]; // 'YYYY-MM-DD'

/**
 * Calculate new streak given existing streak data and today's date.
 * @param {object} userData - Firestore user document data
 * @returns {{ newStreak: number, lastActivityDate: string }}
 */
const calculateStreak = (userData) => {
    const today = getDateString();
    const lastActivity = userData.lastActivityDate || null;

    if (!lastActivity) {
        // First ever activity
        return { newStreak: 1, lastActivityDate: today };
    }

    if (lastActivity === today) {
        // Already recorded activity today — don't increment
        return { newStreak: userData.streak || 1, lastActivityDate: lastActivity };
    }

    const last = new Date(lastActivity);
    const now = new Date(today);
    const diffDays = Math.round((now - last) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
        // Consecutive day — increment streak
        return { newStreak: (userData.streak || 0) + 1, lastActivityDate: today };
    }

    // Gap of more than 1 day — reset streak
    return { newStreak: 1, lastActivityDate: today };
};

module.exports = { calculateStreak };
