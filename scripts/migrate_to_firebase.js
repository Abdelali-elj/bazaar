const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const serviceAccount = require('C:/Users/HP/Desktop/bazaar-style2-firebase-adminsdk-fbsvc-3b37d98f18.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// ─── CATEGORIES ───────────────────────────────────────
const categories = [
  { id: 'cat-protein',   name: 'Lissage Protéiné',      slug: 'lissage-proteine',   description: 'Traitements de lissage à base de protéines pour des cheveux lisses et brillants.', image_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800' },
  { id: 'cat-keratin',   name: 'Lissage Kératine',       slug: 'lissage-keratine',   description: 'Lissage professionnel à la kératine pour une chevelure soyeuse durable.', image_url: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800' },
  { id: 'cat-shampoing', name: 'Pack Shampoing',          slug: 'pack-shampoing',     description: 'Kits shampoings professionnels pour entretenir votre lissage.', image_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=800' },
  { id: 'cat-lisseur',   name: 'Lisseurs Professionnels', slug: 'lisseurs-pro',       description: 'Lisseurs haute performance pour un résultat de salon à la maison.', image_url: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800' },
  { id: 'cat-appareils', name: 'Appareils de Coiffure',   slug: 'appareils-coiffure', description: 'Sèche-cheveux et appareils professionnels pour tous types de cheveux.', image_url: 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=800' },
  { id: 'cat-saphir',    name: 'Saphir Coffret Parfum',   slug: 'saphir-parfums',     description: 'Sets de parfums Saphir élégants pour homme et femme.', image_url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800' },
  { id: 'cat-parfums',   name: 'Parfums Originaux',       slug: 'parfums-originaux',  description: 'Grandes marques de parfums testeurs originaux à prix réduits.', image_url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800' },
];

// ─── PRODUCTS ─────────────────────────────────────────
const products = [
  // ── Lissage Protéiné ──
  { title: 'Terra Coco - Lissage et soin Botox', slug: 'terra-coco-botox', category_id: 'cat-protein', price: 450, stock_quantity: 30, is_featured: true, description: 'Traitement au chocolat végétalien qui régénère et lisse les cheveux. Formule bio et éthique pour un résultat professionnel durable.', images: ['https://cdn.shopify.com/s/files/1/0624/4260/6881/files/terra-coco.jpg'] },
  { title: 'Robson Peluquero Black Love - RP Soin Kit', slug: 'black-love', category_id: 'cat-protein', price: 520, stock_quantity: 25, is_featured: true, description: 'Kit de soin exclusif Black Love par Robson Peluquero. Formule professionnelle pour un lissage de qualité supérieure longue durée.', images: ['https://cdn.shopify.com/s/files/1/0624/4260/6881/files/black-love.jpg'] },
  { title: 'Bright Coffee Secrets', slug: 'bright-coffee', category_id: 'cat-protein', price: 390, stock_quantity: 20, is_featured: false, description: 'Traitement de lissage à base de café pour des cheveux brillants et lisses. Parfum agréable et tenue longue durée.', images: ['https://cdn.shopify.com/s/files/1/0624/4260/6881/files/bright-coffee.jpg'] },
  { title: 'Salvatore Tanino Therapy B', slug: 'salvatore-tanino', category_id: 'cat-protein', price: 480, stock_quantity: 15, is_featured: false, description: 'Thérapie au tanin de haute qualité pour restaurer et lisser les cheveux abîmés. Résultat professionnel garanti.', images: ['https://cdn.shopify.com/s/files/1/0624/4260/6881/files/salvatore.jpg'] },
  { title: 'Aminoplastia Secrets Professional', slug: 'aminoplastia', category_id: 'cat-protein', price: 420, stock_quantity: 18, is_featured: false, description: 'Traitement aminoplastie professionnel pour un lissage progressif sans formaldéhyde. Formule douce et efficace.', images: ['https://cdn.shopify.com/s/files/1/0624/4260/6881/files/aminoplastia.jpg'] },
  { title: 'Biolamination - Brazil Protein', slug: 'biolamination', category_id: 'cat-protein', price: 460, stock_quantity: 22, is_featured: true, description: 'Biolamination professionnelle Brazil Protein pour lisser et nourrir les cheveux en profondeur. Tenue jusqu\'à 3 mois.', images: ['https://cdn.shopify.com/s/files/1/0624/4260/6881/files/biolamination.jpg'] },
  { title: 'Perola Negra - Cortex Melanin', slug: 'perola-negra-cortex', category_id: 'cat-protein', price: 440, stock_quantity: 20, is_featured: false, description: 'Traitement Pérola Negra à la mélanine pour lisser et intensifier la couleur des cheveux foncés.', images: ['https://cdn.shopify.com/s/files/1/0624/4260/6881/files/perola-negra-cortex.jpg'] },
  { title: 'Brazil Protein Bioplastia VEGAN 1L', slug: 'bioplastia-vegan', category_id: 'cat-protein', price: 490, stock_quantity: 12, is_featured: false, description: 'Bioplastie végane 1 litre sans ingrédients d\'origine animale. Lissage et nutrition intense respectueux de l\'environnement.', images: ['https://cdn.shopify.com/s/files/1/0624/4260/6881/files/bioplastia-vegan.jpg'] },
  { title: 'NANO Gel - Brazil Protein', slug: 'nano-gel', category_id: 'cat-protein', price: 320, stock_quantity: 35, is_featured: false, description: 'Nano Gel à la nano-technologie pour un lissage express en 30 minutes. Idéal pour les cheveux fins et mi-épais.', images: ['https://cdn.shopify.com/s/files/1/0624/4260/6881/files/nano-gel.jpg'] },
  { title: 'Black Diamond Premium', slug: 'black-diamond-premium', category_id: 'cat-protein', price: 550, stock_quantity: 10, is_featured: true, description: 'Black Diamond Premium haut de gamme pour un lissage intense de longue durée sur les cheveux les plus rebelles.', images: ['https://cdn.shopify.com/s/files/1/0624/4260/6881/files/black-diamond.jpg'] },
  { title: 'Number One Brasil Banane & Café - Honma Tokyo', slug: 'number-one-banane', category_id: 'cat-protein', price: 410, stock_quantity: 18, is_featured: false, description: 'Lissage Number One à la banane et au café de Honma Tokyo. Formule nourrissante pour un résultat brillant et lisse.', images: ['https://cdn.shopify.com/s/files/1/0624/4260/6881/files/number-one.jpg'] },
  { title: 'Secret Professional Black Pearl', slug: 'black-pearl', category_id: 'cat-protein', price: 430, stock_quantity: 16, is_featured: false, description: 'Traitement Secret Professional à la perle noire pour des cheveux lisses, brillants et nourris en profondeur.', images: ['https://cdn.shopify.com/s/files/1/0624/4260/6881/files/black-pearl.jpg'] },

  // ── Lissage Kératine ──
  { title: 'SOIN Kératine Queen + 20 Ampoules Offertes', slug: 'keratine-queen-ampoules', category_id: 'cat-keratin', price: 580, stock_quantity: 8, is_featured: true, description: 'Kit complet Kératine Queen avec 20 ampoules offertes. Offre spéciale pour un soin professionnel complet.', images: ['https://cdn.shopify.com/s/files/1/0624/4260/6881/files/keratine-queen-1.jpg'] },
  { title: 'Inoar Moroccan 1L', slug: 'inoar-moroccan', category_id: 'cat-keratin', price: 520, stock_quantity: 14, is_featured: false, description: 'Lissage brésilien Inoar Moroccan 1 litre. Formule enrichie aux huiles précieuses du Maroc pour un lissage parfait.', images: ['https://cdn.shopify.com/s/files/1/0624/4260/6881/files/inoar-moroccan.jpg'] },
  { title: 'INOAR G-Hair 1L', slug: 'inoar-g-hair', category_id: 'cat-keratin', price: 495, stock_quantity: 16, is_featured: false, description: 'INOAR G-Hair 1 litre - le classique du lissage brésilien. Formule innovante pour des cheveux lisses pendant plusieurs mois.', images: ['https://cdn.shopify.com/s/files/1/0624/4260/6881/files/inoar-g-hair.jpg'] },
  { title: 'Coffee Green - Honma Tokyo 1L', slug: 'coffee-green', category_id: 'cat-keratin', price: 540, stock_quantity: 12, is_featured: true, description: 'Lissage Coffee Green de Honma Tokyo 1 litre. Formule au café vert pour un lissage professionnel longue durée.', images: ['https://cdn.shopify.com/s/files/1/0624/4260/6881/files/coffee-green.jpg'] },
  { title: 'PROHAIR - Smooth Protein', slug: 'prohair-smooth', category_id: 'cat-keratin', price: 380, stock_quantity: 20, is_featured: false, description: 'PROHAIR Smooth Protein pour un lissage professionnel doux et efficace. Formule sans formaldehyde respectueuse des cheveux.', images: ['https://cdn.shopify.com/s/files/1/0624/4260/6881/files/prohair.jpg'] },
  { title: 'Kativa Kit Lissage Brésilien', slug: 'kativa-kit', category_id: 'cat-keratin', price: 350, stock_quantity: 25, is_featured: false, description: 'Kit de lissage brésilien Kativa complet. Formule sans formaldéhyde pour un lissage progressif naturel.', images: ['https://cdn.shopify.com/s/files/1/0624/4260/6881/files/kativa.jpg'] },
  { title: 'Kératine Queen Coffee Protein', slug: 'keratine-queen-coffee', category_id: 'cat-keratin', price: 420, stock_quantity: 18, is_featured: false, description: 'Kératine Queen Coffee Protein - alliance du café et des protéines pour un lissage intense et nourrissant.', images: ['https://cdn.shopify.com/s/files/1/0624/4260/6881/files/keratine-queen.jpg'] },
  { title: 'Perola Negra - Keratin Gold Lissage', slug: 'perola-keratin-gold', category_id: 'cat-keratin', price: 460, stock_quantity: 15, is_featured: false, description: 'Pérola Negra Keratin Gold pour un lissage de luxe. Formule enrichie à l\'or pour des reflets lumineux.', images: ['https://cdn.shopify.com/s/files/1/0624/4260/6881/files/perola-gold.jpg'] },
  { title: 'Brazilian Protein A - Hair Treatment 800ML', slug: 'brazilian-protein-a', category_id: 'cat-keratin', price: 445, stock_quantity: 14, is_featured: false, description: 'Brazilian Protein A 800ml - traitement professionnel de haute concentration pour un lissage intense.', images: ['https://cdn.shopify.com/s/files/1/0624/4260/6881/files/protein-a.jpg'] },
  { title: 'Keraplex 5min - BK Brazilian Keratin', slug: 'keraplex-5min', category_id: 'cat-keratin', price: 390, stock_quantity: 20, is_featured: false, description: 'Keraplex express en seulement 5 minutes. Traitement révolutionnaire pour un lissage rapide sans sacrifier la qualité.', images: ['https://cdn.shopify.com/s/files/1/0624/4260/6881/files/keraplex.jpg'] },
  { title: 'R-Line Purah - Professionnel Lissage', slug: 'rline-purah', category_id: 'cat-keratin', price: 470, stock_quantity: 12, is_featured: false, description: 'R-Line Purah professionnel pour un lissage de qualité salon. Formule avancée pour tous types de cheveux.', images: ['https://cdn.shopify.com/s/files/1/0624/4260/6881/files/rline.jpg'] },
  { title: 'R-Line Purah - Anti Frizz', slug: 'purah-antifrizz', category_id: 'cat-keratin', price: 340, stock_quantity: 22, is_featured: false, description: 'R-Line Purah Anti Frizz pour discipliner les cheveux rebelles. Solution légère pour un effet lissant quotidien.', images: ['https://cdn.shopify.com/s/files/1/0624/4260/6881/files/purah-antifrizz.jpg'] },

  // ── Pack Shampoing ──
  { title: 'Crystal Organic : Shampooing + Mask + Serum', slug: 'crystal-organic-kit', category_id: 'cat-shampoing', price: 290, stock_quantity: 30, is_featured: true, description: 'Kit Crystal Organic complet : shampooing, masque et sérum pour cheveux lissés. Formule organique pour prolonger votre lissage.', images: ['https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=800'] },
  { title: '6 Armame Macadamia: Shampoo', slug: 'armame-6-shampoo', category_id: 'cat-shampoing', price: 180, stock_quantity: 40, is_featured: false, description: 'Shampooing Armame Macadamia 6 en 1. Nettoie, nourrit et protège les cheveux traités grâce à l\'huile de macadamia.', images: ['https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800'] },
  { title: 'Crystal Monica : Shampooing + Mask + Oil', slug: 'crystal-monica-kit', category_id: 'cat-shampoing', price: 270, stock_quantity: 25, is_featured: false, description: 'Kit Crystal Monica avec shampooing, masque et huile. Alliance parfaite pour maintenir votre lissage et nourrir vos cheveux.', images: ['https://images.unsplash.com/photo-1555580578-7e46a9428c19?w=800'] },
  { title: 'LUMA FOFO Extra Caviar Shampoo - 500ml', slug: 'luma-fofo-caviar', category_id: 'cat-shampoing', price: 220, stock_quantity: 28, is_featured: false, description: 'Shampooing LUMA FOFO Extra Caviar 500ml. Formule enrichie au caviar pour des cheveux nourris, brillants et lisses.', images: ['https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?w=800'] },
  { title: '18 Armame Macadamia: Shampoo + 18 Mask', slug: 'armame-18-kit', category_id: 'cat-shampoing', price: 310, stock_quantity: 20, is_featured: true, description: 'Kit Armame Macadamia 18 avec shampooing et masque. Routine complète pour des cheveux parfaitement nourris et protégés.', images: ['https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800'] },
  { title: 'Keraprime Rosemary Biotin : Shampooing + Mask + Serum', slug: 'keraprime-rosemary-kit', category_id: 'cat-shampoing', price: 285, stock_quantity: 22, is_featured: false, description: 'Kit Keraprime au romarin et à la biotine. Stimule la croissance, renforce et hydrate les cheveux en profondeur.', images: ['https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800'] },
  { title: 'Mielle Rosemary Mint : Shampooing + Démêlant + Mask', slug: 'mielle-rosemary-kit', category_id: 'cat-shampoing', price: 260, stock_quantity: 18, is_featured: false, description: 'Kit Mielle Rosemary Mint complet. Formule naturelle au romarin et à la menthe pour des cheveux forts et éclatants.', images: ['https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800'] },
  { title: 'Crystal Diamond : Shampooing + Mask + Serum', slug: 'crystal-diamond-kit', category_id: 'cat-shampoing', price: 300, stock_quantity: 20, is_featured: false, description: 'Kit Crystal Diamond luxueux avec shampooing, masque et sérum. Formule premium pour des cheveux brillants comme des diamants.', images: ['https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=800'] },
  { title: 'OGX Beauty Shampooing', slug: 'ogx-beauty-shampoo', category_id: 'cat-shampoing', price: 150, stock_quantity: 50, is_featured: false, description: 'Shampooing OGX Beauty aux ingrédients naturels. Nettoie en douceur et laisse les cheveux doux et brillants.', images: ['https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?w=800'] },
  { title: 'Kit Pack Shampoing Hydratant Tanino Therapy', slug: 'pack-shampoing-tanino', category_id: 'cat-shampoing', price: 340, stock_quantity: 15, is_featured: false, description: 'Kit complet Tanino Therapy hydratant. Prolonge votre lissage au tanin et maintient l\'hydratation day after day.', images: ['https://images.unsplash.com/photo-1607006344380-b6775a0824c7?w=800'] },
  { title: 'Pack Crioxidil Macadamia', slug: 'crioxidil-macadamia', category_id: 'cat-shampoing', price: 250, stock_quantity: 22, is_featured: false, description: 'Pack Crioxidil enrichi à la macadamia pour des cheveux nourris, brillants et facilement coiffables.', images: ['https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800'] },
  { title: 'Pack Shampooing Alea - 0% Sulfate 0% Paraben', slug: 'shampooing-alea', category_id: 'cat-shampoing', price: 195, stock_quantity: 35, is_featured: false, description: 'Pack Shampooing Alea sans sulfates et sans parabens. Formule douce pour des cheveux propres sans agresser le lissage.', images: ['https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800'] },

  // ── Lisseurs Professionnels ──
  { title: 'Lisseur Armame Pro Ceramic 450°F', slug: 'lisseur-armame-ceramic', category_id: 'cat-lisseur', price: 750, stock_quantity: 15, is_featured: true, description: 'Lisseur Armame Pro Ceramic jusqu\'à 450°F. Plaque en céramique flottante pour un glissement parfait sans arracher les cheveux.', images: ['https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800'] },
  { title: 'Lisseur à Vapeur ARMAME Steam 450°F', slug: 'lisseur-armame-steam-vapeur', category_id: 'cat-lisseur', price: 890, stock_quantity: 10, is_featured: true, description: 'Lisseur vapeur ARMAME Steam 450°F pour un lissage en douceur. La vapeur hydrate les cheveux pendant le lissage pour un résultat naturel.', images: ['https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800'] },
  { title: 'Lisseur à Vapeur ARMAME 450°F', slug: 'lisseur-armame-vapeur-pro', category_id: 'cat-lisseur', price: 820, stock_quantity: 12, is_featured: false, description: 'Lisseur ARMAME vapeur classique 450°F. Combine chaleur et vapeur pour lisser sans abîmer les cheveux les plus fragiles.', images: ['https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800'] },
  { title: 'Lisseur ARMAME Portable - Sans Fil 450°F', slug: 'lisseur-armame-portable', category_id: 'cat-lisseur', price: 680, stock_quantity: 18, is_featured: false, description: 'Lisseur ARMAME sans fil 450°F. Idéal pour les voyages et les retouches rapides. Autonomie de 30 minutes par charge.', images: ['https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800'] },
  { title: 'SteamPod 3.0 Lisseur Vapeur Professionnel', slug: 'steampod-3', category_id: 'cat-lisseur', price: 1850, stock_quantity: 5, is_featured: true, description: 'L\'Oréal Professionnel SteamPod 3.0 - le lisseur vapeur professionnel de référence. Technologie vapeur intégrée pour un lissage respectueux.', images: ['https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800'] },
  { title: 'Professional Hair Salon Steam Styler', slug: 'steam-styler-pro', category_id: 'cat-lisseur', price: 950, stock_quantity: 8, is_featured: false, description: 'Styliseur vapeur professionnel de salon. Multi-fonctions pour lisser, boucler et onduler les cheveux en toute facilité.', images: ['https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800'] },
  { title: 'GI&GI Plaque Céramique PC 4.5', slug: 'gigi-pc-45', category_id: 'cat-lisseur', price: 580, stock_quantity: 14, is_featured: false, description: 'Lisseur GI&GI Plaque Céramique PC 4.5. Température maximale de 450°F pour un lissage ultra-rapide et précis.', images: ['https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800'] },
  { title: 'GI&GI Plaque Céramique PC 5.2', slug: 'gigi-pc-52', category_id: 'cat-lisseur', price: 620, stock_quantity: 12, is_featured: false, description: 'Lisseur GI&GI PC 5.2 avec plaque large en céramique. Idéal pour les cheveux épais et longs, résultats en moins de temps.', images: ['https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800'] },
  { title: 'BaByliss Pro The Straightener', slug: 'babyliss-pro-straightener', category_id: 'cat-lisseur', price: 1100, stock_quantity: 6, is_featured: true, description: 'BaByliss Pro The Straightener - la référence professionnelle. Plaque titanium ultra-performante pour un lissage parfait dès le premier passage.', images: ['https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800'] },
  { title: 'Lisseur Lizze Extreme 480°', slug: 'lizze-extreme-lisseur', category_id: 'cat-lisseur', price: 1350, stock_quantity: 7, is_featured: false, description: 'Lisseur Lizze Extreme 480° - technologie brésilienne de pointe. Ultra haute température pour les cheveux les plus résistants.', images: ['https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800'] },
  { title: 'REVLON One-Step Volumizer PLUS', slug: 'revlon-one-step', category_id: 'cat-lisseur', price: 780, stock_quantity: 10, is_featured: false, description: 'REVLON One-Step Volumizer PLUS - sèche, lisse et ajoute du volume en une seule étape. L\'outil 2-en-1 indispensable.', images: ['https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800'] },

  // ── Appareils de Coiffure ──
  { title: 'Pack Sèchoir GEK 3800 + Boucleur GEK 980°', slug: 'gek-pack-boucleur', category_id: 'cat-appareils', price: 1200, stock_quantity: 8, is_featured: true, description: 'Pack professionnel incluant le sèche-cheveux Ceriotti GEK 3800 et le boucleur GEK 980°. La combinaison parfaite pour un salon à domicile.', images: ['https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=800'] },
  { title: 'DAESOL POWER 1900 SALON', slug: 'daesol-1900', category_id: 'cat-appareils', price: 650, stock_quantity: 12, is_featured: false, description: 'Sèche-cheveux DAESOL POWER 1900W professionnel. Moteur puissant pour un séchage rapide et homogène.', images: ['https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=800'] },
  { title: 'SÈCHE CHEVEUX LIZZE EXTREME 2400W', slug: 'sechoir-lizze-2400', category_id: 'cat-appareils', price: 980, stock_quantity: 7, is_featured: false, description: 'Sèche-cheveux Lizze Extreme 2400W ultra-puissant. Technologie ionique pour un séchage 3x plus rapide et des cheveux lisses et brillants.', images: ['https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=800'] },
  { title: 'Sèche-cheveux Formula 9000', slug: 'formula-9000', category_id: 'cat-appareils', price: 750, stock_quantity: 10, is_featured: false, description: 'Sèche-cheveux Formula 9000 professionnel avec moteur ultra-puissant. Résultat impeccable en un minimum de temps.', images: ['https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=800'] },
  { title: 'Sèche-cheveux Ceriotti SUPER GEK 3800', slug: 'ceriotti-gek-3800', category_id: 'cat-appareils', price: 1100, stock_quantity: 5, is_featured: true, description: 'Le légendaire sèche-cheveux Ceriotti GEK 3800 de salon. Référence mondiale pour les coiffeurs professionnels.', images: ['https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=800'] },
  { title: 'المشط الحراري الأصلي - One Step™ Original', slug: 'one-step-original', category_id: 'cat-appareils', price: 590, stock_quantity: 15, is_featured: false, description: 'المشط الحراري الأصلي One Step™ - يمشط ويجفف في خطوة واحدة. تقنية السيراميك للحفاظ على صحة الشعر.', images: ['https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=800'] },
  { title: 'مصفف الشعر 5 في 1 الجديد', slug: 'hot-air-styler-5in1', category_id: 'cat-appareils', price: 680, stock_quantity: 12, is_featured: false, description: 'مصفف شعر 5 في 1 متعدد الوظائف. يجفف، يلمع، يجعّد، يموّج ويضخم الشعر باستخدام أداة واحدة.', images: ['https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=800'] },

  // ── Saphir Coffret Parfum ──
  { title: 'Set de Parfum Femme Saphir Cool 2 Pièces', slug: 'saphir-cool-femme', category_id: 'cat-saphir', price: 285, stock_quantity: 25, is_featured: true, description: 'Set de parfum femme Saphir Cool 2 pièces : flacon 200ml + miniature 30ml. Senteur fraîche et légère, idéal pour l\'été.', images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800'] },
  { title: 'Set de Parfum Femme Saphir My Future 2 Pièces', slug: 'saphir-my-future', category_id: 'cat-saphir', price: 285, stock_quantity: 22, is_featured: false, description: 'Set de parfum femme Saphir My Future 2 pièces. Fragrance florale et féminine pour une femme moderne et ambitieuse.', images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=800'] },
  { title: 'Set de Parfum Femme Saphir Vida 2 Pièces', slug: 'saphir-vida-femme', category_id: 'cat-saphir', price: 285, stock_quantity: 20, is_featured: false, description: 'Set de parfum femme Saphir Vida 2 pièces. Senteur envoûtante et sensuelle pour une femme sûre d\'elle.', images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800'] },
  { title: 'Set de Parfum Homme Saphir Perfect Man 2 Pièces', slug: 'saphir-perfect-man', category_id: 'cat-saphir', price: 285, stock_quantity: 20, is_featured: false, description: 'Set de parfum homme Saphir Perfect Man 2 pièces. Fragrance boisée et fraîche pour l\'homme élégant et distingué.', images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=800'] },
  { title: 'Set de Parfum Homme Saphir The Fighter 2 Pièces', slug: 'saphir-the-fighter', category_id: 'cat-saphir', price: 285, stock_quantity: 18, is_featured: false, description: 'Set de parfum homme Saphir The Fighter 2 pièces. Senteur intense et volontaire pour un homme déterminé.', images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800'] },
  { title: 'Saphir The Best 200ml + 30ml', slug: 'saphir-the-best', category_id: 'cat-saphir', price: 260, stock_quantity: 25, is_featured: false, description: 'Saphir The Best - parfum intemporel 200ml + miniature 30ml. Un classique raffiné que l\'on n\'oublie pas.', images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=800'] },
  { title: 'Saphir Le Dernier Homme 200ml + 30ml', slug: 'saphir-dernier-homme', category_id: 'cat-saphir', price: 260, stock_quantity: 22, is_featured: false, description: 'Saphir Le Dernier Homme 200ml + 30ml. Fragrance masculine élégante et sophistiquée pour l\'homme d\'aujourd\'hui.', images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800'] },
  { title: 'Saphir Perfect Man 200ml + 30ml Pack', slug: 'saphir-perfect-man-pack', category_id: 'cat-saphir', price: 260, stock_quantity: 20, is_featured: false, description: 'Pack Saphir Perfect Man 200ml + 30ml. Le parfum masculin signature en format duo économique.', images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=800'] },

  // ── Parfums Originaux ──
  { title: 'عطر خمره للجنسين من لطافه 100مل', slug: 'khamrah-unisex', category_id: 'cat-parfums', price: 450, stock_quantity: 15, is_featured: true, description: 'عطر خمره الأصيل من لطافه للجنسين - 100 مل. عطر شرقي فاخر بخامات نادرة يدوم طويلاً.', images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800'] },
  { title: 'Maison Francis Kurkdjian Baccarat Rouge 540 Extrait', slug: 'baccarat-rouge-540', category_id: 'cat-parfums', price: 850, stock_quantity: 8, is_featured: true, description: 'Testeur original Baccarat Rouge 540 Extrait - l\'un des parfums les plus iconiques au monde. Notes de jasmin, safran et ambre.', images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800'] },
  { title: 'Lancôme La Vie Est Belle - Testeur 75ml', slug: 'lancome-la-vie-est-belle', category_id: 'cat-parfums', price: 680, stock_quantity: 10, is_featured: false, description: 'Testeur original Lancôme La Vie Est Belle 75ml. Le parfum floral gourmand best-seller mondial de Lancôme.', images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=800'] },
  { title: 'Narciso Rodriguez For Her Black Original Testeur', slug: 'narciso-rodriguez-black', category_id: 'cat-parfums', price: 620, stock_quantity: 10, is_featured: false, description: 'Testeur original Narciso Rodriguez For Her Black - version intense et mystérieuse du célèbre For Her.', images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800'] },
  { title: 'Narciso Rodriguez For Her Original Testeur', slug: 'narciso-rodriguez-original', category_id: 'cat-parfums', price: 590, stock_quantity: 12, is_featured: false, description: 'Testeur original Narciso Rodriguez For Her - le musc floral emblématique. Fragrance sensuelle et élégante.', images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=800'] },
  { title: 'Narciso Rodriguez Fleur Musc Original Testeur', slug: 'narciso-fleur-musc', category_id: 'cat-parfums', price: 610, stock_quantity: 8, is_featured: false, description: 'Testeur original Narciso Rodriguez For Her Fleur Musc - l\'expression florale du musc iconic de Narciso.', images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800'] },
  { title: 'Atelier Versace Cédrat De Diamante Unisex', slug: 'versace-cedrat-diamante', category_id: 'cat-parfums', price: 720, stock_quantity: 6, is_featured: false, description: 'Testeur original Atelier Versace Cédrat De Diamante Unisex. Fraîcheur agrumée et pureté cristalline pour une fragrance unisexe raffinée.', images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=800'] },
  { title: 'Carolina Herrera 212 Men Heroes Forever Young', slug: 'ch-212-forever-young', category_id: 'cat-parfums', price: 580, stock_quantity: 10, is_featured: false, description: 'Testeur original Carolina Herrera 212 Men Heroes Forever Young. La fragrance pour les héros modernes qui refusent de vieillir.', images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800'] },
  { title: 'Versace Bright Crystal Original Testeur', slug: 'versace-bright-crystal', category_id: 'cat-parfums', price: 560, stock_quantity: 12, is_featured: false, description: 'Testeur original Versace Bright Crystal. Fragrance fraîche et lumineuse aux notes de pivoine et magnolia.', images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=800'] },
  { title: "Dior J'adore Original Testeur", slug: 'dior-jadore', category_id: 'cat-parfums', price: 740, stock_quantity: 8, is_featured: true, description: "Testeur original Dior J'adore - l'icône de la féminité. Bouquet floral lumineux avec des notes de ylang-ylang et jasmin.", images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800'] },
  { title: 'Tom Ford Arabian Wood Original Testeur', slug: 'tom-ford-arabian-wood', category_id: 'cat-parfums', price: 890, stock_quantity: 5, is_featured: false, description: 'Testeur original Tom Ford Arabian Wood. Bois précieux et épices orientales pour un homme d\'exception au raffinement sans limite.', images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=800'] },
  { title: 'Creed Aventus Original Testeur', slug: 'creed-aventus', category_id: 'cat-parfums', price: 1200, stock_quantity: 4, is_featured: true, description: 'Testeur original Creed Aventus - le parfum masculin le plus célèbre au monde. Notes d\'ananas, bouleau fumé et musc.', images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800'] },
];

async function migrate() {
  console.log(`\n🚀 Starting migration to Firebase: bazaar-style2`);
  console.log(`📦 Categories to upload: ${categories.length}`);
  console.log(`🛍️  Products to upload: ${products.length}\n`);

  // Upload categories
  const catBatch = db.batch();
  for (const cat of categories) {
    const ref = db.collection('categories').doc(cat.id);
    const { id, ...data } = cat;
    catBatch.set(ref, { ...data, created_at: new Date().toISOString() });
  }
  await catBatch.commit();
  console.log(`✅ ${categories.length} categories uploaded.`);

  // Upload products in batches of 30
  let uploaded = 0;
  for (let i = 0; i < products.length; i += 25) {
    const batch = db.batch();
    const chunk = products.slice(i, i + 25);
    for (const prod of chunk) {
      const ref = db.collection('products').doc();
      batch.set(ref, { ...prod, created_at: new Date().toISOString() });
    }
    await batch.commit();
    uploaded += chunk.length;
    console.log(`✅ ${uploaded}/${products.length} products uploaded...`);
  }

  console.log(`\n🎉 Migration complete!`);
  console.log(`   Categories: ${categories.length}`);
  console.log(`   Products: ${products.length}`);
  console.log(`\n💡 Restart your dev server to see the changes.`);
  process.exit(0);
}

migrate().catch(err => {
  console.error('❌ Migration failed:', err.message);
  process.exit(1);
});
