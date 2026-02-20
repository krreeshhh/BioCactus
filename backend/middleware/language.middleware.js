const { db } = require('../services/firebase.service');

const SUPPORTED_LANGUAGES = {
    'en': 'English',
    'ta': 'Tamil',
    'te': 'Telugu',
    'ml': 'Malayalam',
    'hi': 'Hindi',
    'kn': 'Kannada'
};

const languageMiddleware = async (req, res, next) => {
    // 1. Check header
    let lang = req.headers['x-language'];

    // 2. If not in header and user is authenticated, check preferredLanguage in Firestore
    if (!lang && req.user && req.user.uid) {
        try {
            const userDoc = await db.collection('users').doc(req.user.uid).get();
            if (userDoc.exists) {
                lang = userDoc.data().preferredLanguage;
            }
        } catch (error) {
            console.error('Error fetching user language preference:', error);
        }
    }

    // 3. Fallback to English
    if (!lang || !SUPPORTED_LANGUAGES[lang]) {
        lang = 'en';
    }

    req.language = lang;
    req.languageName = SUPPORTED_LANGUAGES[lang];

    next();
};

module.exports = { languageMiddleware, SUPPORTED_LANGUAGES };
