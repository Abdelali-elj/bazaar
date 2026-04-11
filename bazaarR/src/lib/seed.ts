import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

// Load env vars
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const categoriesData = [
  { name: "Lissage Protein", description: "Hair Protein Treatment" },
  { name: "Parfums", description: "Fragrances" },
  { name: "Pack Shampoing", description: "Shampoo Packs" },
  { name: "Lissage Keratin", description: "Hair Keratin Treatment" },
  { name: "Soin Visage", description: "Skincare" },
  { name: "Appareils de coiffure", description: "Hair Styling Tools" },
  { name: "Beauté & Santé", description: "Beauty & Health" }
];

const productsData = [
  {
    title: "Robson Peluquero Black Love - RP Soin Kit",
    price: 235.00,
    category: "Lissage Protein",
    image_url: "https://cdn.youcan.shop/stores/36376d919ddca0b665be1eb9ae68e7bd/others/qFyiA6nMdnmzY2imK20LtqMkGzfw9DqUkmQNK7pZ.jpeg"
  },
  {
    title: "Terra Coco Lissage et soin Botox",
    price: 251.00,
    category: "Lissage Protein",
    image_url: "https://cdn.youcan.shop/stores/36376d919ddca0b665be1eb9ae68e7bd/others/JjacI7FtmBQ9atfO1dIoG78OhKrTBmZe72l5QSu6.jpeg"
  },
  {
    title: "Bright Coffee Secrets",
    price: 202.00,
    category: "Lissage Protein",
    image_url: "https://cdn.youcan.shop/stores/36376d919ddca0b665be1eb9ae68e7bd/others/V5XGSONSvNpMUdYzS2BoxQWm4DQ465SZgzBMN2Ll.jpeg"
  },
  {
    title: "Tom Ford Ombre Leather Testeur 100ml",
    price: 43.00,
    category: "Parfums",
    image_url: "https://cdn.youcan.shop/stores/bazaarstyle/others/HUoZ9EfNOK9L7kJLFLn8MsMSSFG6AX17DHiQ6hOJ.png"
  },
  {
    title: "Sauvage Dior Eau de Parfum Testeur 100ml",
    price: 50.00,
    category: "Parfums",
    image_url: "https://cdn.youcan.shop/stores/bazaarstyle/theme-settings/IKCZO29QTxcTa2OvfjhRL57LlmYhVVFliumEqjSC.png"
  },
  {
    title: "L'Homme Yves Saint Laurent Original Testeur",
    price: 43.00,
    category: "Parfums",
    image_url: "https://cdn.youcan.shop/stores/36376d919ddca0b665be1eb9ae68e7bd/others/k0hLRx9NNyJCSKm4L68AZn6gqhJFK7t2pH0ZwP0T.jpeg"
  },
  {
    title: "MIGE HAIR SHAMPOO AVOCADO - 800ml",
    price: 35.00,
    category: "Pack Shampoing",
    image_url: "https://cdn.youcan.shop/stores/36376d919ddca0b665be1eb9ae68e7bd/others/i95Itxh4DFF2w7WAZhcZWZ0195OjaoHITOEGChbq.jpeg"
  }
];

async function seed() {
  console.log("Starting seeding...");

  // 1. Seed Categories
  const categoryMap: Record<string, string> = {};
  for (const cat of categoriesData) {
    const slug = cat.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const { data, error } = await supabase
      .from("categories")
      .upsert({ name: cat.name, slug, description: cat.description }, { onConflict: "slug" })
      .select()
      .single();

    if (error) {
      console.error(`Error seeding category ${cat.name}:`, error.message);
    } else {
      categoryMap[cat.name] = data.id;
      console.log(`Seeded category: ${cat.name}`);
    }
  }

  // 2. Seed Products
  for (const prod of productsData) {
    const slug = prod.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const category_id = categoryMap[prod.category] || null;

    const { error } = await supabase
      .from("products")
      .upsert({
        title: prod.title,
        slug,
        price: prod.price,
        description: `${prod.title} imported from bazaarstyle.ma`,
        category_id,
        images: [prod.image_url],
        stock_quantity: 50,
        is_featured: true
      }, { onConflict: "slug" });

    if (error) {
      console.error(`Error seeding product ${prod.title}:`, error.message);
    } else {
      console.log(`Seeded product: ${prod.title}`);
    }
  }

  console.log("Seeding complete!");
}

seed();
