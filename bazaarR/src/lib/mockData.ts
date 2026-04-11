export const MOCK_PRODUCTS = [
  {
    id: "mock-1",
    title: "Sérum Anti-Âge Global",
    slug: "serum-anti-age-global",
    price: 450,
    description: "Un sérum d'exception qui régénère la peau pendant la nuit.",
    category_id: "mock-cat-1",
    is_featured: true,
    stock_quantity: 10,
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1200"],
    created_at: new Date().toISOString()
  },
  {
    id: "mock-2",
    title: "Crème Hydratante Intense",
    slug: "creme-hydratante-intense",
    price: 320,
    description: "Crème riche en acide hyaluronique pour une hydratation 48h.",
    category_id: "mock-cat-1",
    is_featured: false,
    stock_quantity: 50,
    images: ["https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=1200"],
    created_at: new Date().toISOString()
  },
  {
    id: "mock-3",
    title: "Huile Scintillante Corps",
    slug: "huile-scintillante-corps",
    price: 250,
    description: "Huile sèche illuminatrice au parfum d'été.",
    category_id: "mock-cat-2",
    is_featured: true,
    stock_quantity: 20,
    images: ["https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200"],
    created_at: new Date().toISOString()
  },
  {
    id: "mock-4",
    title: "Masque Purifiant Argile",
    slug: "masque-purifiant-argile",
    price: 180,
    description: "Masque détoxifiant à l'argile verte et arbre à thé.",
    category_id: "mock-cat-1",
    is_featured: false,
    stock_quantity: 15,
    images: ["https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1200"],
    created_at: new Date().toISOString()
  }
];

export const MOCK_CATEGORIES = [
  { id: "mock-cat-1", name: "Soins Visage", slug: "soins-visage" },
  { id: "mock-cat-2", name: "Soins Corps", slug: "soins-corps" },
  { id: "mock-cat-3", name: "Cheveux", slug: "cheveux" }
];
