import { createClient } from '@supabase/supabase-js';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// 1. Initialiser Supabase
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // On peut utiliser la clé anon pour la lecture, ou service_role pour tout lire
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. Initialiser Firebase Admin
const serviceAccountPath = path.resolve(process.cwd(), 'public/bazaar-style-firebase-adminsdk-fbsvc-df745bffdc.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function migrateData() {
  console.log('--- DEBUT DE LA MIGRATION VERS FIREBASE ---');

  // --- 1. MIGRATION DES CATEGORIES ---
  console.log('\n📦 Migration des Catégories...');
  const { data: categories, error: catError } = await supabase.from('categories').select('*');
  if (catError) {
    console.error('Erreur lecture Categories Supabase:', catError);
  } else if (categories) {
    for (const cat of categories) {
      await db.collection('categories').doc(cat.id).set({
        name: cat.name,
        slug: cat.slug,
        description: cat.description || null,
        image_url: cat.image_url || null,
        created_at: cat.created_at
      });
      console.log(`  -> Catégorie migrée: ${cat.name}`);
    }
    console.log(`✅ ${categories.length} catégories migrées.`);
  }

  // --- 2. MIGRATION DES PRODUITS ---
  console.log('\n🛍️ Migration des Produits...');
  const { data: products, error: prodError } = await supabase.from('products').select('*');
  if (prodError) {
    console.error('Erreur lecture Products Supabase:', prodError);
  } else if (products) {
    for (const prod of products) {
      await db.collection('products').doc(prod.id).set({
        title: prod.title,
        slug: prod.slug,
        description: prod.description || null,
        price: prod.price,
        stock_quantity: prod.stock_quantity,
        category_id: prod.category_id || null,
        images: prod.images || [],
        is_featured: prod.is_featured || false,
        created_at: prod.created_at
      });
      console.log(`  -> Produit migré: ${prod.title}`);
    }
    console.log(`✅ ${products.length} produits migrés.`);
  }

  // --- 3. MIGRATION DES UTILISATEURS / PROFILES ---
  console.log('\n👥 Migration des Profils Utilisateurs...');
  const { data: profiles, error: profError } = await supabase.from('profiles').select('*');
  if (profError) {
    console.error('Erreur lecture Profiles Supabase:', profError);
  } else if (profiles) {
    for (const prof of profiles) {
      await db.collection('users').doc(prof.id).set({
        first_name: prof.first_name || null,
        last_name: prof.last_name || null,
        email: prof.email || null,
        phone: prof.phone || null,
        role: prof.role || 'customer',
        created_at: prof.created_at
      });
      console.log(`  -> Profil migré: ${prof.email}`);
    }
    console.log(`✅ ${profiles.length} profils migrés.`);
  }

  // --- 4. MIGRATION DES COMMANDES ---
  console.log('\n📦 Migration des Commandes...');
  const { data: orders, error: orderError } = await supabase.from('orders').select('*, order_items(*)');
  if (orderError) {
    console.error('Erreur lecture Orders Supabase:', orderError);
  } else if (orders) {
    for (const order of orders) {
      // Dans Firebase, on peut sauvegarder les items directement dans le document de la commande
      await db.collection('orders').doc(order.id).set({
        user_id: order.user_id,
        status: order.status,
        total_amount: order.total_amount,
        created_at: order.created_at,
        items: order.order_items.map((item: any) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price_at_time: item.price_at_time
        }))
      });
      console.log(`  -> Commande migrée: ${order.id}`);
    }
    console.log(`✅ ${orders.length} commandes migrées.`);
  }

  console.log('\n🎉 MIGRATION TERMINEE AVEC SUCCES ! 🎉');
}

migrateData().catch(console.error);
