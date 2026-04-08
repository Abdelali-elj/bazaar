import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// Clean up environment variables
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
let privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;
if (privateKeyRaw && privateKeyRaw.startsWith('"') && privateKeyRaw.endsWith('"')) {
  privateKeyRaw = privateKeyRaw.slice(1, -1);
}
const privateKey = privateKeyRaw?.replace(/\\n/g, '\n');

// Standard initialization for Next.js - no top-level await for better compatibility
if (!admin.apps.length) {
  try {
    if (projectId && clientEmail && privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        storageBucket: "bazaar-style.appspot.com"
      });
      console.log("Firebase Admin Initialized (Env).");
    } else {
      const serviceAccountPath = path.resolve(process.cwd(), 'bazaar-style-firebase-adminsdk-fbsvc-df745bffdc.json');
      if (fs.existsSync(serviceAccountPath)) {
        const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          storageBucket: "bazaar-style.appspot.com"
        });
        console.log("Firebase Admin Initialized (JSON).");
      }
    }
  } catch (err: any) {
    console.error("Firebase Admin Init Error: ", err.message);
  }
}

export const adminDb = admin.firestore();
export const adminStorage = admin.storage();
export const adminAuth = admin.auth();
