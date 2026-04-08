const https = require('https');
const fs = require('fs');

const slugs = [
  'bazaarstyle-9','black-love','bright-coffee','salvatore','aminoplastia',
  'biolamination','perola-negra','bioplastia-vegan','nano','black-diamond-premium',
  'number-one-banane','black-pearl',
  'keratine-queen-1','inoar-moroccan','inoar-g-hair','coffee-green','prohair',
  'kativa','keratine-queen','perola','protein-a','keraplex','rline','purah-antifrizz',
  'orga','arm6','crys2','luma-fofo','arm','b7b','mielle','crys','ogx',
  'pack-tanino','crioxidil-macadamia','shampooing-alea',
  'lisseur-aramame-rouge','lisseur-vapeur-steam','lisseur-armame-vapeur','lisseur-portable',
  'steampod','professional-steam-styler','gigi-pc-45','gigi-pc-52','babyliss','lizze','revlon',
  'gek-boucleur','daesol','sechlizze','formula-9000','gek','one-step','hot-air-styler',
  'saphir-cool-set','saphir-my-future-set','saphir-vida-set','saphir-perfect-man-set',
  'saphir-parfums-the-fighter-set','saphir-the-best','saphir-dernier-homme','saphir-perfect-man-pack',
  'khamrah','baccarat-rouge','la-vie-est-belle','narciso-rodriguez-for-her2',
  'narciso-rodriguez-for-her1','narciso-rodriguez-for-her-fleur-musc-original-testeur',
  'atelier-versace-cedrat-de-diamante-unisex-original-testeur','212-forever-young',
  'versace-bright','dior-jadore-original-testeur','ford-arabian-wood','aventus-creed',
];

function fetchHtml(slug) {
  return new Promise((resolve, reject) => {
    const url = `https://bazaarstyle.ma/products/${slug}`;
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html',
      }
    };
    https.get(url, options, (res) => {
      // Follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, options, (res2) => {
          let data = '';
          res2.on('data', c => data += c);
          res2.on('end', () => resolve(data));
        }).on('error', reject);
        return;
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function extractMeta(html, property) {
  const match = html.match(new RegExp(`<meta[^>]+(?:property|name)="${property}"[^>]+content="([^"]+)"`, 'i'))
    || html.match(new RegExp(`<meta[^>]+content="([^"]+)"[^>]+(?:property|name)="${property}"`, 'i'));
  return match ? match[1] : null;
}

function extractPrice(html) {
  // Try JSON-LD
  const jsonLdMatch = html.match(/"price"\s*:\s*"?([\d.]+)"?/);
  if (jsonLdMatch) return parseFloat(jsonLdMatch[1]);
  // Try meta
  const priceMatch = html.match(/class="[^"]*price[^"]*"[^>]*>([\d\s,.]+(?:MAD|DH)?)/i);
  if (priceMatch) return parseFloat(priceMatch[1].replace(/[^\d.]/g, ''));
  return null;
}

function extractImages(html, slug) {
  const images = new Set();
  // og:image
  const og = extractMeta(html, 'og:image');
  if (og) images.add(og.startsWith('//') ? 'https:' + og : og);
  // All CDN images from Shopify
  const cdnRegex = /https?:\/\/cdn\.shopify\.com\/s\/files\/[^"'\s]+\.(?:jpg|jpeg|png|webp)/gi;
  let m;
  while ((m = cdnRegex.exec(html)) !== null) {
    const img = m[0].split('?')[0];
    images.add(img);
  }
  return [...images].slice(0, 6);
}

async function main() {
  console.log(`\nScraping ${slugs.length} products from bazaarstyle.ma (HTML mode)...\n`);
  const results = [];

  for (const slug of slugs) {
    try {
      const html = await fetchHtml(slug);
      const title = extractMeta(html, 'og:title') || slug;
      const description = extractMeta(html, 'og:description') || '';
      const images = extractImages(html, slug);
      const price = extractPrice(html);

      if (images.length > 0) {
        console.log(`✅ ${title.substring(0,50)} - ${images.length} images - ${price ? price + ' MAD' : 'price N/A'}`);
        results.push({ slug, title, description, images, price, success: true });
      } else {
        console.log(`⚠️  ${slug} - no images found`);
        results.push({ slug, title, description, images: [], price, success: false });
      }
    } catch (err) {
      console.log(`❌ ${slug}: ${err.message}`);
      results.push({ slug, success: false, error: err.message });
    }
    await new Promise(r => setTimeout(r, 300));
  }

  const successful = results.filter(r => r.success && r.images?.length > 0);
  fs.writeFileSync('scripts/scraped_products.json', JSON.stringify(results, null, 2));
  console.log(`\n✅ Done! ${successful.length}/${slugs.length} products with images.`);
  console.log('Saved to scripts/scraped_products.json');
}

main().catch(console.error);
