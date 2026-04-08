"use client";
import { useState, useEffect } from "react";
import { getProducts } from "@/lib/actions/products";
import { getCategories } from "@/lib/actions/categories";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mockData";
import { ArrowLeft, ArrowRight, Search, SlidersHorizontal, Wallet, ArrowRight as ArrowRightIcon } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import ProductQuickView from "@/components/products/ProductQuickView";
import ProductSkeleton from "@/components/products/ProductSkeleton";
import { Product } from "@/lib/types";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [currentCatIndex, setCurrentCatIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const categoryParam = searchParams?.get('category');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodsRes, catsRes] = await Promise.all([getProducts(), getCategories()]);
        
        const beautyImages = [
          "https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=1200",
          "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200",
          "https://images.unsplash.com/photo-1512496015851-a90fb38ba4a6?q=80&w=1200",
          "https://images.unsplash.com/photo-1591360236480-4ed861025fa1?q=80&w=1200",
          "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1200",
          "https://images.unsplash.com/photo-1625091302231-7bc9a497f9c4?q=80&w=1200",
        ];

        let finalProducts = prodsRes;
        if (!finalProducts || finalProducts.length === 0) {
          finalProducts = MOCK_PRODUCTS;
        }

        if (finalProducts && Array.isArray(finalProducts)) {
          setProducts(finalProducts.map((p: any, i: number) => ({
            ...p,
            images: p.images?.length > 0 ? p.images : [beautyImages[i % beautyImages.length]]
          })));
        }

        let allCats = [];
        if (catsRes && Array.isArray(catsRes)) {
          allCats = [{ id: 'all', name: 'Tous les produits' }, ...catsRes];
        } else {
          allCats = [{ id: 'all', name: 'Tous les produits' }, ...MOCK_CATEGORIES];
        }
        setCategories(allCats);

        // Pre-select category if provided in URL
        if (categoryParam) {
          const index = allCats.findIndex(c => String(c.id) === String(categoryParam));
          if (index !== -1) {
            setCurrentCatIndex(index);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setProducts(MOCK_PRODUCTS);
        setCategories([{ id: 'all', name: 'Tous les produits' }, ...MOCK_CATEGORIES]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryParam]);

  useEffect(() => {
    setCurrentPage(1);
  }, [currentCatIndex, searchQuery, priceRange, sortBy]);

  const activeCategory = categories[currentCatIndex] || { id: 'all', name: 'Tous les produits' };

  const handleNextCategory = () => {
    if (categories.length > 0) {
      setCurrentCatIndex((currentCatIndex + 1) % categories.length);
    }
  };

  const handlePrevCategory = () => {
    if (categories.length > 0) {
      setCurrentCatIndex((currentCatIndex - 1 + categories.length) % categories.length);
    }
  };

  let filteredProducts = (activeCategory && activeCategory.id !== 'all')
    ? products.filter(p => String(p.category_id) === String(activeCategory.id))
    : products;

  if (searchQuery.trim() !== '') {
    const query = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.title.toLowerCase().includes(query) || 
      (p.description && p.description.toLowerCase().includes(query))
    );
  }

  if (priceRange === 'under-200') {
    filteredProducts = filteredProducts.filter(p => Number(p.price) < 200);
  } else if (priceRange === '200-500') {
    filteredProducts = filteredProducts.filter(p => Number(p.price) >= 200 && Number(p.price) <= 500);
  } else if (priceRange === 'above-500') {
    filteredProducts = filteredProducts.filter(p => Number(p.price) > 500);
  }

  if (sortBy === 'newest') {
    filteredProducts = [...filteredProducts].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } else if (sortBy === 'price-asc') {
    filteredProducts = [...filteredProducts].sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sortBy === 'price-desc') {
    filteredProducts = [...filteredProducts].sort((a, b) => Number(b.price) - Number(a.price));
  }

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <main className="min-h-screen pt-28 md:pt-40 pb-32 bg-[#F8FAF5]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* ─── PREMIUM HEADER ─── */}
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-px bg-[#C9A96E]" />
                  <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#C9A96E]">L'Atelier Bazaar</span>
              </div>
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold text-[#1A2E28] tracking-tighter leading-[0.85] font-outfit">
                Découvrir la <br />
                <span className="italic font-normal text-[#C9A96E] font-playfair">Beauté Pure</span>
              </h1>
            </div>
        </div>

        {/* ─── PREMIUM FILTER BAR ─── */}
        <div className="mb-20 flex gap-4 items-stretch animate-in fade-in duration-700 delay-300">
          {/* Main Filter Card */}
          <div className="flex-1 rounded-2xl overflow-hidden border border-[#E8E3DB] shadow-md bg-white p-6">
              {/* Row 1: Title & Subtitle */}
              <div className="mb-6">
                  <h3 className="text-[#1A2E28] font-bold text-lg font-outfit">Catalogue</h3>
                  <p className="text-slate-400 text-xs mt-0.5 font-light">Trouvez ce que vous cherchez</p>
              </div>

              {/* Row 2: Search Bar + Category Switcher */}
              <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                  <div className="flex-1 w-full relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Search size={14} className="text-slate-400 group-focus-within:text-[#1A2E28] transition-colors" />
                      </div>
                      <input
                          type="text"
                          placeholder="Que recherchez-vous ?"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-[#f8f9fa] border border-slate-200 text-[#1A2E28] text-sm pl-10 pr-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-[#1A2E28]/10 focus:border-[#1A2E28]/40 placeholder-slate-400 transition-all font-medium"
                      />
                  </div>

                  <div className="flex items-center gap-2 bg-[#1A2E28] rounded-xl px-4 py-2 shrink-0 shadow-sm w-full md:w-auto justify-between">
                      <button
                          onClick={handlePrevCategory}
                          className="w-6 h-6 rounded-full bg-white/10 hover:bg-[#C9A96E] flex items-center justify-center text-white/60 hover:text-white transition-all duration-200"
                      >
                          <ArrowLeft size={10} />
                      </button>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white min-w-[120px] text-center px-2">
                          {activeCategory.name}
                      </span>
                      <button
                          onClick={handleNextCategory}
                          className="w-6 h-6 rounded-full bg-white/10 hover:bg-[#C9A96E] flex items-center justify-center text-white/60 hover:text-white transition-all duration-200"
                      >
                          <ArrowRight size={10} />
                      </button>
                  </div>
              </div>

              {/* Row 3: Sort & Budget */}
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-100">
                  <div className="flex flex-wrap items-center gap-6 w-full lg:w-auto">
                      <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 text-slate-400">
                              <SlidersHorizontal size={12} />
                              <span className="text-[9px] font-black uppercase tracking-[0.2em]">Trier</span>
                          </div>
                          <div className="flex items-center bg-[#F3F1ED] rounded-lg p-0.5">
                              {[
                                  { val: 'newest', label: 'Nouveau' },
                                  { val: 'price-asc', label: 'Prix ↑' },
                                  { val: 'price-desc', label: 'Prix ↓' },
                              ].map(opt => (
                                  <button
                                      key={opt.val}
                                      onClick={() => setSortBy(opt.val)}
                                      className={`px-3 py-1.5 rounded-md text-[8px] font-black uppercase tracking-[0.12em] transition-all duration-200 whitespace-nowrap ${
                                          sortBy === opt.val
                                              ? 'bg-[#1A2E28] text-white shadow-sm'
                                              : 'text-slate-400 hover:text-[#1A2E28]'
                                      }`}
                                  >
                                      {opt.label}
                                  </button>
                              ))}
                          </div>
                      </div>

                      <div className="hidden sm:block w-px h-6 bg-slate-200 shrink-0" />

                      <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 text-slate-400">
                              <Wallet size={12} />
                              <span className="text-[9px] font-black uppercase tracking-[0.2em]">Budget</span>
                          </div>
                          <div className="flex items-center bg-[#F3F1ED] rounded-lg p-0.5">
                              {[
                                  { val: 'all', label: 'Tous' },
                                  { val: 'under-200', label: '< 200' },
                                  { val: '200-500', label: '200–500' },
                                  { val: 'above-500', label: '500+' },
                              ].map(opt => (
                                  <button
                                      key={opt.val}
                                      onClick={() => setPriceRange(opt.val)}
                                      className={`px-3 py-1.5 rounded-md text-[8px] font-black uppercase tracking-[0.12em] transition-all duration-200 whitespace-nowrap ${
                                          priceRange === opt.val
                                              ? 'bg-[#1A2E28] text-white shadow-sm'
                                              : 'text-slate-400 hover:text-[#1A2E28]'
                                      }`}
                                  >
                                      {opt.label}
                                  </button>
                              ))}
                          </div>
                      </div>
                  </div>

                  <span className="text-[10px] font-bold text-emerald-600/60 bg-emerald-50 px-3 py-1.5 rounded-full uppercase tracking-widest shrink-0 whitespace-nowrap">
                      {filteredProducts.length} produits
                  </span>
              </div>
          </div>

          {/* Promo Card (Optional, but included for same look) */}
          <div className="hidden lg:flex flex-col justify-between bg-[#1A2E28] rounded-2xl p-6 w-[340px] relative overflow-hidden shrink-0 cursor-pointer group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#C9A96E]/20 via-transparent to-transparent" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#C9A96E]/10 rounded-full blur-3xl" />
              <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                      <div className="w-5 h-px bg-[#C9A96E]/40" />
                      <span className="text-[7px] font-black uppercase tracking-[0.4em] text-[#C9A96E]">Qualité Garantie</span>
                  </div>
                  <p className="text-white text-[20px] font-bold leading-[1.15] font-outfit">
                      Réinventez votre <br /> routine beauté,
                  </p>
                  <p className="text-[#C9A96E] italic font-light text-[16px] mt-1 font-playfair">
                      l'excellence vous attend.
                  </p>
                  <p className="text-white/30 text-[9px] mt-3 font-light leading-relaxed max-w-[160px]">
                      Plongez dans un univers de soins prestigieux et offrez-vous l'expérience que vous méritez vraiment.
                  </p>
              </div>
              <div className="relative z-10 mt-5">
                  <div className="flex items-center gap-3 group-hover:gap-4 transition-all">
                      <span className="text-[8px] font-black uppercase tracking-widest text-white/40 group-hover:text-[#C9A96E] transition-colors">Explorer</span>
                      <div className="flex-1 h-px bg-white/10 group-hover:bg-[#C9A96E]/40 transition-colors" />
                      <ArrowRightIcon size={12} className="text-white/20 group-hover:text-[#C9A96E] group-hover:translate-x-1 transition-all" />
                  </div>
              </div>
          </div>
        </div>

        {/* ─── PRODUCTS GRID ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))
          ) : (
            paginatedProducts.map((product, index) => (
              <div 
                key={product.id}
                style={{ 
                  opacity: 0, 
                  animation: `fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 80}ms forwards` 
                }}
              >
                <ProductCard product={product} onQuickView={setSelectedProduct} />
              </div>
            ))
          )}
        </div>

        {/* ─── PAGINATION ─── */}
        {totalPages > 1 && (
          <div className="mt-20 flex items-center justify-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-xl border border-[#E8E3DB] bg-white flex items-center justify-center text-[#1A2E28]/40 hover:text-[#1A2E28] hover:border-[#1A2E28]/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
            >
              <ArrowLeft size={16} />
            </button>

            <div className="flex items-center bg-white border border-[#E8E3DB] rounded-xl p-1 shadow-sm">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                // Basic logic to show limited pages if too many (optional, but keep simple for now as requested)
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`min-w-[40px] h-8 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                      currentPage === pageNum
                        ? 'bg-[#1A2E28] text-white shadow-md'
                        : 'text-[#1A2E28]/40 hover:text-[#1A2E28] hover:bg-slate-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 rounded-xl border border-[#E8E3DB] bg-white flex items-center justify-center text-[#1A2E28]/40 hover:text-[#1A2E28] hover:border-[#1A2E28]/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* ─── EMPTY STATE ─── */}
        {filteredProducts.length === 0 && !loading && (
          <div className="py-40 flex flex-col items-center justify-center text-center border-t border-[#1A2E28]/5 mt-20 animate-in fade-in duration-700">
            <div className="w-20 h-px bg-[#C9A96E]/20 mb-8" />
            <h2 className="text-xl font-bold text-[#1A2E28] uppercase tracking-[0.2em] font-outfit opacity-40">Aucun produit trouvé</h2>
            <p className="text-[#1A2E28]/30 mt-4 font-medium text-xs tracking-widest uppercase">
              Affinez votre recherche pour découvrir nos trésors.
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
          @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
          }
      `}</style>

      <ProductQuickView product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </main>
  );
}

