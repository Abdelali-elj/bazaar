const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
let privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;
if (privateKeyRaw && privateKeyRaw.startsWith('"') && privateKeyRaw.endsWith('"')) {
  privateKeyRaw = privateKeyRaw.slice(1, -1);
}
const privateKey = privateKeyRaw?.replace(/\\n/g, '\n');

try {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    })
  });
  console.log("Firebase Admin Initialized.");
} catch (e) {
  console.error("Initialization error:", e.message);
  process.exit(1);
}

const storage = admin.storage();
storage.getBuckets().then(([buckets]) => {
  console.log("SUCCESS_LISTING_BUCKETS");
  if (buckets.length === 0) {
    console.log("No buckets found in this project.");
  }
  buckets.forEach(b => {
    console.log("BUCKET_NAME:" + b.name);
  });
  process.exit(0);
}).catch(err => {
  console.error("Storage Error Type:", err.constructor.name);
  console.error("Full Storage Error:", err);
  process.exit(1);
});
