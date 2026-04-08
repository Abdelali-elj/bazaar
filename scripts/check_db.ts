import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

const serviceAccountPath = path.resolve(process.cwd(), 'bazaar-style-firebase-adminsdk-fbsvc-df745bffdc.json');
if (!admin.apps.length) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}
const db = admin.firestore();

async function check() {
    const products = await db.collection('products').get();
    const categories = await db.collection('categories').get();
    
    console.log(`Verified Products: ${products.size}`);
    console.log(`Verified Categories: ${categories.size}`);
    
    if (products.size > 0) {
        console.log('Sample Product:', products.docs[0].data().title);
    }
}

check().catch(console.error);
