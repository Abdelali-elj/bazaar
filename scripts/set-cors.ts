import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
let privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;
if (privateKeyRaw && privateKeyRaw.startsWith('"') && privateKeyRaw.endsWith('"')) {
  privateKeyRaw = privateKeyRaw.slice(1, -1);
}
const privateKey = privateKeyRaw?.replace(/\\n/g, '\n');

if (!projectId || !clientEmail || !privateKey) {
  console.error("Missing Firebase Admin credentials in .env.local");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId,
    clientEmail,
    privateKey,
  }),
  storageBucket: "bazaar-style.firebasestorage.app"
});

const bucket = admin.storage().bucket();

const corsConfiguration = [
  {
    origin: ["*"], // allow all origins for dev and prod
    method: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
    responseHeader: ["Content-Type", "Authorization", "Content-Length", "User-Agent", "x-goog-resumable"],
    maxAgeSeconds: 3600
  }
];

bucket.setCorsConfiguration(corsConfiguration)
  .then(() => {
    console.log("CORS configuration set successfully!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error setting CORS configuration:", err);
    process.exit(1);
  });
