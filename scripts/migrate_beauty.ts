
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseKey!);

async function migrate() {
  // Beauty Products Data
  const beautyProducts = [
    {
      title: "Metallic Shine Palette",
      description: "Ultra-pigmented eyeshadow palette with a glossy metallic finish. 12 shades.",
      price: 45.00,
      stock_quantity: 100,
      is_featured: true,
      image_url: "/brain/beauty_hero_metallic_1773409458263.png"
    },
    {
      title: "Velvet Matte Lipstick",
      description: "Long-lasting matte lipstick with a velvety smooth finish and intense pigment.",
      price: 28.00,
      stock_quantity: 200,
      is_featured: true,
      image_url: "https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=1000&auto=format&fit=crop"
    },
    {
      title: "Full Coverage Fluid Foundation",
      description: "Lightweight, breathable foundation with 24-hour full coverage and a natural finish.",
      price: 38.00,
      stock_quantity: 150,
      is_featured: true,
      image_url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop"
    },
    {
      title: "Dazzle Pink Eyeshadow",
      description: "Sparkling powder eyeshadow with multi-dimensional shimmer.",
      price: 18.00,
      stock_quantity: 300,
      is_featured: true,
      image_url: "https://images.unsplash.com/photo-1591360236480-4ed861025fa1?q=80&w=1000&auto=format&fit=crop"
    }
  ];

  console.log("Migrating products...");
  
  // Clear existing (optional, but for a clean 'Noelle' look it's better)
  // await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  for (const product of beautyProducts) {
    const slug = product.title.toLowerCase().replace(/\s+/g, '-');
    const { error } = await supabase.from('products').upsert({
      ...product,
      slug
    }, { onConflict: 'slug' });
    
    if (error) console.error(`Error inserting ${product.title}:`, error);
    else console.log(`Inserted ${product.title}`);
  }
}

migrate();
