
import { getProducts } from './src/lib/actions/products';
import { getCategories } from './src/lib/actions/categories';
import * as fs from 'fs';

async function test() {
    console.log("Testing Firestore Connection...");
    try {
        const products = await getProducts();
        const categories = await getCategories();
        const result = {
            productCount: products?.length || 0,
            categoryCount: categories?.length || 0,
            firstProduct: products?.[0] || null,
            isMock: products?.[0]?.id?.startsWith('mock-')
        };
        fs.writeFileSync('firestore_debug.json', JSON.stringify(result, null, 2));
        console.log("Debug info written to firestore_debug.json");
    } catch (err) {
        fs.writeFileSync('firestore_debug.json', JSON.stringify({ error: err.message, stack: err.stack }, null, 2));
        console.log("Error written to firestore_debug.json");
    }
}

test();
