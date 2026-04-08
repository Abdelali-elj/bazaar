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
db.collection("products").get().then(snapshot => {
  console.log("SUCCESS_FETCH_FOR_IMAGES");
  let found = false;
  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.images && data.images.length > 0) {
      console.log("Product ID: " + doc.id);
      console.log("Image URL: " + data.images[0]);
      found = true;
    }
  });
  if (!found) console.log("NO_IMAGES_FOUND_IN_DB");
  process.exit(0);
}).catch(err => {
  console.error("ERROR:" + err.message);
  process.exit(1);
});
