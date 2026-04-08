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

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    })
  });
}

const db = admin.firestore();
// Attempt to fetch first to ensure we have a real ID
db.collection("products").limit(1).get().then(async snapshot => {
  if (snapshot.empty) {
    console.log("NO_PRODUCTS_TO_DELETE");
    process.exit(0);
  }
  const id = snapshot.docs[0].id;
  console.log(`ATTEMPTING_DELETE_OF_ID: ${id}`);
  try {
    await db.collection("products").doc(id).delete();
    console.log("SUCCESS_DELETED_IN_DB");
    process.exit(0);
  } catch (err) {
    console.error("DELETE_FAILED:" + err.message);
    process.exit(1);
  }
}).catch(err => {
  console.error("FETCH_FAILED:" + err.message);
  process.exit(1);
});
