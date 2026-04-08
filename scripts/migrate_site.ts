import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// Initialize Firebase Admin
const serviceAccountPath = path.resolve(process.cwd(), 'bazaar-style-firebase-adminsdk-fbsvc-df745bffdc.json');
if (!admin.apps.length) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}
const db = admin.firestore();

async function clearCollection(collectionName: string) {
    const snapshot = await db.collection(collectionName).get();
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });
    await batch.commit();
    console.log(`Cleared collection: ${collectionName}`);
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function scrapeProduct(url: string) {
    try {
        const curlCmd = `curl.exe -s -A "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1" "${url}"`;
        const html = execSync(curlCmd, { encoding: 'utf-8', maxBuffer: 1024 * 1024 * 5 });
        
        // Extract data from :product attribute (it's HTML entities encoded JSON)
        const productAttrMatch = html.match(/:product="({[\s\S]*?})"/i);
        
        let title = '';
        let price = 0;
        let images: string[] = [];
        let description = '';
        let categoryName = '';

        if (productAttrMatch) {
            try {
                // Decode HTML entities
                const decodedJson = productAttrMatch[1].replace(/&quot;/g, '"')
                    .replace(/&amp;/g, '&')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&#39;/g, "'")
                    .replace(/&nbsp;/g, ' ');
                
                const productData = JSON.parse(decodedJson);
                title = productData.name || productData.title;
                price = parseFloat(productData.price) || 0;
                images = productData.images ? productData.images.map((img: any) => img.url || img) : [];
                description = (productData.description || '').replace(/<[^>]*>/g, ' ').trim();
            } catch (e) {
                console.error("Failed to parse product JSON from attribute", e);
            }
        }

        // Fallback or augment with LD+JSON
        if (!title || !price || images.length === 0) {
            const ldJsonMatch = html.match(/<script type=['"]application\/ld\+json['"]>([\s\S]*?)<\/script>/i);
            if (ldJsonMatch) {
                try {
                    const ldData = JSON.parse(ldJsonMatch[1]);
                    if (!title) title = ldData.name;
                    if (!description) description = (ldData.description || '').replace(/<[^>]*>/g, ' ').trim();
                    if (images.length === 0 && ldData.image) images = [ldData.image];
                    if (!price && ldData.offers) price = parseFloat(ldData.offers.price);
                    categoryName = ldData.category;
                } catch (e) {}
            }
        }

        if (!title) {
            const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || html.match(/<title>([\s\S]*?)<\/title>/i);
            title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '').trim() : 'Unknown Product';
            if (title.includes('|')) title = title.split('|')[0].trim();
        }
        
        if (title.toLowerCase().includes('mobile only access')) {
            console.log(`Skipping ${url} - Hit bot protection`);
            return null;
        }

        const slug = url.split('/').pop() || '';

        return {
            title,
            slug,
            description,
            price,
            stock_quantity: 10,
            images,
            categoryName,
            is_featured: false,
            created_at: new Date().toISOString()
        };
    } catch (error) {
        console.error(`Error scraping ${url}:`, error);
        return null;
    }
}

async function migrate() {
    console.log('--- STARTING MIGRATION ---');
    
    // Clear existing data
    await clearCollection('products');
    await clearCollection('categories');
    
    // 1. Categories (Hardcoded based on sitemap research for safety)
    const categoriesList = [
        { id: 'protein', name: 'Lissage Protein', slug: 'protein' },
        { id: 'keratin', name: 'Keratin', slug: 'keratin' },
        { id: 'shampoing', name: 'Shampoing', slug: 'shampoing' },
        { id: 'appareils', name: 'Appareils', slug: 'appareils' },
        { id: 'parfums', name: 'Parfums', slug: 'parfums' },
        { id: 'cadeaux', name: 'Cadeaux', slug: 'cadeaux' },
        { id: 'beaute', name: 'Beauté', slug: 'beaute' }
    ];

    for (const cat of categoriesList) {
        await db.collection('categories').doc(cat.id).set({
            ...cat,
            description: null,
            image_url: null,
            created_at: new Date().toISOString()
        });
        console.log(`Created category: ${cat.name}`);
    }

    // 2. Products
    console.log('Fetching all product URLs from sitemap...');
    const sitemapRes = await fetch('https://bazaarstyle.ma/sitemap/products_01.xml');
    const sitemapXml = await sitemapRes.text();
    const productUrls = [...sitemapXml.matchAll(/<loc>(https:\/\/bazaarstyle\.ma\/products\/[^<]+)<\/loc>/g)].map(m => m[1]);
    
    console.log(`Found ${productUrls.length} products to migrate.`);

    for (let i = 0; i < productUrls.length; i++) {
        const url = productUrls[i];
        console.log(`[${i+1}/${productUrls.length}] Fetching ${url}...`);
        
        const product = await scrapeProduct(url);
        if (product) {
            // Assign a category based on keywords
            let category_id = 'beaute';
            const lowTitle = product.title.toLowerCase();
            if (lowTitle.includes('protein')) category_id = 'protein';
            else if (lowTitle.includes('keratin')) category_id = 'keratin';
            else if (lowTitle.includes('shampoo') || lowTitle.includes('shampoing') || lowTitle.includes('soin')) category_id = 'shampoing';
            else if (lowTitle.includes('lisseur') || lowTitle.includes('styler') || lowTitle.includes('brosse')) category_id = 'appareils';
            else if (lowTitle.includes('dior') || lowTitle.includes('parfum') || lowTitle.includes('tester') || lowTitle.includes('scandal')) category_id = 'parfums';

            await db.collection('products').add({
                ...product,
                category_id
            });
            console.log(`   -> Migrated: ${product.title} (${product.price} MAD)`);
        }
        
        // Sleep to avoid rate limiting
        await sleep(1000);
    }

    console.log('--- MIGRATION COMPLETED ---');
}

migrate().catch(console.error);
