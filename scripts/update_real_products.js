const admin = require('firebase-admin');
const fs = require('fs');

const serviceAccount = require('C:/Users/HP/Desktop/bazaar-style2-firebase-adminsdk-fbsvc-3b37d98f18.json');

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
const db = admin.firestore();

// Category mapping by slug
const SLUG_TO_CAT = {
  'bazaarstyle-9':'cat-protein','black-love':'cat-protein','bright-coffee':'cat-protein',
  'salvatore':'cat-protein','aminoplastia':'cat-protein','biolamination':'cat-protein',
  'perola-negra':'cat-protein','bioplastia-vegan':'cat-protein','nano':'cat-protein',
  'black-diamond-premium':'cat-protein','number-one-banane':'cat-protein','black-pearl':'cat-protein',
  'keratine-queen-1':'cat-keratin','inoar-moroccan':'cat-keratin','inoar-g-hair':'cat-keratin',
  'coffee-green':'cat-keratin','prohair':'cat-keratin','kativa':'cat-keratin',
  'keratine-queen':'cat-keratin','perola':'cat-keratin','protein-a':'cat-keratin',
  'keraplex':'cat-keratin','rline':'cat-keratin','purah-antifrizz':'cat-keratin',
  'orga':'cat-shampoing','arm6':'cat-shampoing','crys2':'cat-shampoing','luma-fofo':'cat-shampoing',
  'arm':'cat-shampoing','b7b':'cat-shampoing','mielle':'cat-shampoing','crys':'cat-shampoing',
  'ogx':'cat-shampoing','pack-tanino':'cat-shampoing','crioxidil-macadamia':'cat-shampoing',
  'shampooing-alea':'cat-shampoing',
  'lisseur-aramame-rouge':'cat-lisseur','lisseur-vapeur-steam':'cat-lisseur',
  'lisseur-armame-vapeur':'cat-lisseur','lisseur-portable':'cat-lisseur',
  'steampod':'cat-lisseur','professional-steam-styler':'cat-lisseur',
  'gigi-pc-45':'cat-lisseur','gigi-pc-52':'cat-lisseur','babyliss':'cat-lisseur',
  'lizze':'cat-lisseur','revlon':'cat-lisseur',
  'gek-boucleur':'cat-appareils','daesol':'cat-appareils','sechlizze':'cat-appareils',
  'formula-9000':'cat-appareils','gek':'cat-appareils','one-step':'cat-appareils',
  'hot-air-styler':'cat-appareils',
  'saphir-cool-set':'cat-saphir','saphir-my-future-set':'cat-saphir','saphir-vida-set':'cat-saphir',
  'saphir-perfect-man-set':'cat-saphir','saphir-parfums-the-fighter-set':'cat-saphir',
  'saphir-the-best':'cat-saphir','saphir-dernier-homme':'cat-saphir','saphir-perfect-man-pack':'cat-saphir',
  'khamrah':'cat-parfums','baccarat-rouge':'cat-parfums','la-vie-est-belle':'cat-parfums',
  'narciso-rodriguez-for-her2':'cat-parfums','narciso-rodriguez-for-her1':'cat-parfums',
  'narciso-rodriguez-for-her-fleur-musc-original-testeur':'cat-parfums',
  'atelier-versace-cedrat-de-diamante-unisex-original-testeur':'cat-parfums',
  '212-forever-young':'cat-parfums','versace-bright':'cat-parfums',
  'dior-jadore-original-testeur':'cat-parfums','ford-arabian-wood':'cat-parfums','aventus-creed':'cat-parfums',
};

async function updateProducts() {
  const scraped = JSON.parse(fs.readFileSync('scripts/scraped_products.json', 'utf8'));
  const successful = scraped.filter(p => p.success && p.images?.length > 0);
  console.log(`\n🔄 Updating ${successful.length} products in Firebase with REAL data...\n`);
  
  // Delete existing products first
  const existing = await db.collection('products').get();
  console.log(`🗑️  Deleting ${existing.size} old products...`);
  const delBatch = db.batch();
  existing.docs.forEach(doc => delBatch.delete(doc.ref));
  await delBatch.commit();
  console.log('✅ Old products deleted.\n');

  // Upload real products in batches
  let uploaded = 0;
  for (let i = 0; i < successful.length; i += 25) {
    const batch = db.batch();
    const chunk = successful.slice(i, i + 25);
    for (const p of chunk) {
      const ref = db.collection('products').doc();
      const title = p.title
        .replace(' | Achetez en ligne chez BazaarStyle', '')
        .replace(/&amp;/g, '&')
        .replace(/&#039;/g, "'")
        .trim();
      const desc = (p.description || '')
        .replace(/&amp;/g, '&')
        .replace(/&#039;/g, "'")
        .replace(/&eacute;/g, 'é')
        .replace(/&agrave;/g, 'à')
        .replace(/&egrave;/g, 'è')
        .substring(0, 500)
        .trim();
      const slug = title.toLowerCase()
        .replace(/[^a-z0-9\u00C0-\u017F\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 80);
      batch.set(ref, {
        title,
        slug,
        description: desc,
        price: p.price || 0,
        images: p.images,
        category_id: SLUG_TO_CAT[p.slug] || 'cat-protein',
        stock_quantity: 50,
        is_featured: i < 8,
        created_at: new Date().toISOString(),
      });
    }
    await batch.commit();
    uploaded += chunk.length;
    console.log(`✅ ${uploaded}/${successful.length} products updated...`);
  }

  console.log(`\n🎉 All done! ${successful.length} products with REAL images & prices uploaded.`);
  process.exit(0);
}

updateProducts().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
