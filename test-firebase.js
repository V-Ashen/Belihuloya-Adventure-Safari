const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
require('dotenv').config({ path: './apps/web/.env.local' });

const privateKey = process.env.FIREBASE_PRIVATE_KEY;
console.log("Raw Key Starts with:", privateKey.substring(0, 30));
console.log("Has literal \\n:", privateKey.includes('\\n'));
console.log("Has actual newline:", privateKey.includes('\n'));

const formattedKey = privateKey.replace(/\\n/g, '\n').replace(/"/g, '');

try {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: formattedKey,
    }),
  });
  
  const db = getFirestore();
  db.collection('settings').doc('site_settings').get()
    .then(doc => console.log('Doc exists?', doc.exists))
    .catch(err => console.error('Firestore Error:', err));
} catch (e) {
  console.error("Init error:", e);
}
