const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

if (!firebaseConfig.projectId || !firebaseConfig.clientEmail || !firebaseConfig.privateKey) {
  console.warn("Firebase configuration is missing in .env file. Firebase will not be initialized correctly.");
}

try {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig)
  });
} catch (error) {
  console.error("Firebase admin initialization error:", error);
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth, admin };
