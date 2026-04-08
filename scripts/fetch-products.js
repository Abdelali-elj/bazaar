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
db.collection("products").limit(5).get().then(snapshot => {
  console.log("SUCCESS_FETCHING_PRODUCTS");
  snapshot.forEach(doc => {
    console.log("PRODUCT_ID:" + doc.id);
    console.log("PRODUCT_DATA:" + JSON.stringify(doc.data()));
  });
  process.exit(0);
}).catch(err => {
  console.error("ERROR_FETCHING_PRODUCTS:", err.message);
  process.exit(1);
});
