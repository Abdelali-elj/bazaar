import { getProducts } from "@/lib/actions/products";
import { getCategories } from "@/lib/actions/categories";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Category } from "@/lib/types";
import ProductCard from "@/components/products/ProductCard";

export default async function CategorySlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categoriesRaw = await getCategories().catch(() => []);
  const categories = categoriesRaw as Category[];
  const category = categories.find((c: any) => c.slug === slug);

  if (!category) notFound();

  const allProductsRaw = await getProducts().catch(() => []);
  const allProducts = allProductsRaw as any[];
  const products = allProducts.filter((p: any) => p.category_id === category.id);

  return (
    <main className="min-h-screen pt-40 pb-32 bg-white">
      <div className="container-wide px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-16 animate-fade-in justify-center">
          <Link href="/" className="hover:text-slate-900 transition-colors">Accueil</Link>
          <div className="w-1 h-1 rounded-full bg-slate-200" />
          <Link href="/allproduct" className="hover:text-slate-900 transition-colors">Boutique</Link>
          <div className="w-1 h-1 rounded-full bg-slate-200" />
          <span className="text-primary">{category.name}</span>
        </nav>

        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-24 space-y-8 animate-fade-up">
          <div className="space-y-4">
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em] block">
                Signature Atelier
            </span>
            <h1 className="text-6xl md:text-9xl font-playfair italic text-slate-900 leading-tight font-light lowercase">
              {category.name}
            </h1>
          </div>
          <div className="flex items-center justify-center gap-6 py-8">
            <div className="w-16 h-px bg-slate-100" />
            <div className="w-2 h-2 rounded-full border border-primary" />
            <div className="w-16 h-px bg-slate-100" />
          </div>
          <p className="text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed text-sm tracking-wide">
            {category.description || `Découvrez l'essence de ${category.name}, une sélection exclusive conçue pour l'élégance et le raffinement.`}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-16 lg:gap-x-10 lg:gap-y-24">
          {products.map((product: any, index: number) => (
            <div 
                key={product.id}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 50}ms` }}
            >
                <ProductCard product={product} onQuickView={() => {}} />
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="py-40 text-center space-y-8 bg-slate-50 rounded-[3rem] border border-slate-100 max-w-4xl mx-auto">
            <div className="text-5xl font-playfair italic text-slate-200">Bientôt disponible...</div>
            <p className="text-slate-400 font-medium uppercase text-[10px] tracking-widest">Nous préparons cette collection exclusive pour vous.</p>
            <Link href="/allproduct" className="inline-flex items-center gap-4 px-10 py-4 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-slate-200">
                Explorer tout le catalogue
                <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
