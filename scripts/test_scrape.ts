const url = 'https://bazaarstyle.ma/products/black-love';
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1';

async function test() {
    const res = await fetch(url, {
        headers: {
            'User-Agent': UA,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
            'Referer': 'https://bazaarstyle.ma/',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        }
    });
    const html = await res.text();
    console.log('HTML Length:', html.length);
    console.log('Contains "Mobile Only Access":', html.includes('Mobile Only Access'));
    
    const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    console.log('Title Match:', titleMatch ? titleMatch[1].trim() : 'None');

    const priceMatch = html.match(/"price"\s*:\s*"(\d+(?:\.\d+)?)"/) || html.match(/"product-price"[^>]*>([\d.,\s]+)/);
    console.log('Price Match:', priceMatch ? priceMatch[1] : 'None');
    
    // Check if there is a JSON object
    const jsonMatch = html.match(/window.product\s*=\s*(\{[\s\S]*?\});/);
    if (jsonMatch) {
        console.log('Found product JSON!');
        const product = JSON.parse(jsonMatch[1]);
        console.log('JSON Title:', product.name || product.title);
        console.log('JSON Price:', product.price);
    }
}

test().catch(console.error);
