
import React, { useState, useEffect } from 'react';
import { getProducts } from '@/lib/actions/products';
import { getCategories } from '@/lib/actions/categories';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '@/lib/mockData';
import ProductCard from './ProductCard';
import ProductQuickView from './ProductQuickView';
import { Product } from '@/lib/types';
import { Loader2, ArrowLeft, ArrowRight, ArrowRight as ArrowRightIcon, Layout, Zap, MapPin, ChevronDown, Search, SlidersHorizontal, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';


const ProductSkeleton = () => (
    <div className="flex flex-col gap-5 animate-pulse">
        <div className="aspect-square bg-slate-100 rounded-2xl" />
        <div className="space-y-3">
            <div className="flex justify-between">
                <div className="h-3 w-20 bg-slate-100 rounded" />
                <div className="h-3 w-16 bg-slate-100 rounded" />
            </div>
            <div className="h-5 w-full bg-slate-100 rounded" />
            <div className="h-4 w-3/4 bg-slate-100 rounded" />
            <div className="h-10 w-full bg-slate-100 rounded-xl mt-4" />
        </div>
    </div>
);

export default function ProductSection() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentCatIndex, setCurrentCatIndex] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [sortBy, setSortBy] = useState('newest');
    const [priceRange, setPriceRange] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catsData, prodsData] = await Promise.all([getCategories(), getProducts()]);
                
                // Handle Categories
                const cats = catsData && Array.isArray(catsData) ? catsData : MOCK_CATEGORIES;
                setCategories([{ id: 'all', name: 'Tous les produits' }, ...cats]);

                // Handle Products
                let finalProducts = prodsData && Array.isArray(prodsData) && prodsData.length > 0 ? prodsData : MOCK_PRODUCTS;

                const beautyImages = [
                    "https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=1200",
                    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200",
                    "https://images.unsplash.com/photo-1512496015851-a90fb38ba4a6?q=80&w=1200",
                    "https://images.unsplash.com/photo-1591360236480-4ed861025fa1?q=80&w=1200",
                    "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1200",
                    "https://images.unsplash.com/photo-1625091302231-7bc9a497f9c4?q=80&w=1200",
                ];

                const enriched = finalProducts.map((p: any, i: number) => ({
                    ...p,
                    images: p.images?.length > 0 ? p.images : [beautyImages[i % beautyImages.length]]
                }));
                setProducts(enriched);
            } catch (error) {
                console.error('Failed to fetch store data:', error);
                setCategories([{ id: 'all', name: 'Tous les produits' }, ...MOCK_CATEGORIES]);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const activeCategory = categories[currentCatIndex] || { id: 'all', name: 'Tous les produits' };
    
    const handleCategoryChange = (index: number) => {
        setCurrentCatIndex(index);
    };

    const handleNextCategory = () => {
        if (categories.length > 0) {
            handleCategoryChange((currentCatIndex + 1) % categories.length);
        }
    };

    const handlePrevCategory = () => {
        if (categories.length > 0) {
            handleCategoryChange((currentCatIndex - 1 + categories.length) % categories.length);
        }
    };
    
    let processedProducts = (activeCategory && activeCategory.id !== 'all')
        ? products.filter(p => {
            const prodCatId = String(p.category_id || (p as any).categories?.id || '');
            const selectedCatId = String(activeCategory.id);
            return prodCatId === selectedCatId;
          })
        : products;

    // Debugging (Remove in production if needed)
    if (activeCategory.id !== 'all' && processedProducts.length === 0 && products.length > 0) {
        console.log('Filter Mismatch:', {
            selectedCatId: activeCategory.id,
            firstProductCatId: products[0].category_id,
            firstProductNestedCatId: (products[0] as any).categories?.id
        });
    }

    if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        processedProducts = processedProducts.filter(p => 
            p.title.toLowerCase().includes(query) || 
            (p.description && p.description.toLowerCase().includes(query))
        );
    }

    if (priceRange === 'under-200') {
        processedProducts = processedProducts.filter(p => p.price < 200);
    } else if (priceRange === '200-500') {
        processedProducts = processedProducts.filter(p => p.price >= 200 && p.price <= 500);
    } else if (priceRange === 'above-500') {
        processedProducts = processedProducts.filter(p => p.price > 500);
    }

    if (sortBy === 'newest') {
        processedProducts = [...processedProducts].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === 'price-asc') {
        processedProducts = [...processedProducts].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
        processedProducts = [...processedProducts].sort((a, b) => b.price - a.price);
    }

    const displayedProducts = processedProducts.slice(0, 8);

    return (
        <section id="shop" className="w-full py-20 bg-[#F8FAF5] relative overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
                
                {/* ─── HEADER AREA ─── */}
                <div className="flex flex-col mb-12">
                    {/* Main Title Row */}
                    <div className="flex flex-col items-center text-center mb-16 w-full">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-px bg-[#C9A96E]/50" />
                            <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#C9A96E]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                Notre Boutique
                            </span>
                            <div className="w-12 h-px bg-[#C9A96E]/50" />
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal leading-[1.1] tracking-tight" style={{ fontFamily: "'Playfair Display', serif", color: '#1A2E28' }}>
                            Collections <br className="md:hidden" />
                            <span className="italic text-[#C9A96E]">Signature</span>
                        </h2>
                    </div>

                    {/* ─── FILTER BAR + PROMO CARD ─── */}
                    <div className="flex flex-col lg:flex-row gap-4 items-stretch">

                        {/* Main Filter Card */}
                        <div className="flex-1 rounded-2xl overflow-hidden border border-[#E8E3DB] shadow-md bg-white p-6">
                            
                            {/* Row 1: Title & Subtitle */}
                            <div className="mb-6">
                                <h3 className="text-[#1A2E28] font-bold text-lg" style={{ fontFamily: "'Outfit', sans-serif" }}>Catalogue</h3>
                                <p className="text-slate-400 text-xs mt-0.5 font-light">Trouvez ce que vous cherchez</p>
                            </div>

                            {/* Row 2: Search Bar + Category Switcher */}
                            <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                                {/* Search Bar (Pro) */}
                                <div className="flex-1 w-full relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Search size={14} className="text-slate-400 group-focus-within:text-[#1A2E28] transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Que recherchez-vous ?"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        suppressHydrationWarning={true}
                                        className="w-full bg-[#f8f9fa] border border-slate-200 text-[#1A2E28] text-sm pl-10 pr-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-[#1A2E28]/10 focus:border-[#1A2E28]/40 placeholder-slate-400 transition-all font-medium"
                                        style={{ fontFamily: "'Inter', sans-serif" }}
                                    />
                                </div>

                                {/* Category Switcher (Arrow Style) */}
                                <div className="flex items-center gap-2 bg-[#1A2E28] rounded-xl px-4 py-2 shrink-0 shadow-sm w-full md:w-auto justify-between">
                                    <button
                                        onClick={handlePrevCategory}
                                        className="w-6 h-6 rounded-full bg-white/10 hover:bg-[#C9A96E] flex items-center justify-center text-white/60 hover:text-white transition-all duration-200"
                                    >
                                        <ArrowLeft size={10} />
                                    </button>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white min-w-[120px] text-center px-2" style={{ fontFamily: "'Inter', sans-serif" }}>
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
                                    {/* Sort Group */}
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
                                                    style={{ fontFamily: "'Inter', sans-serif" }}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Divider (Small screens) */}
                                    <div className="hidden sm:block w-px h-6 bg-slate-200 shrink-0" />

                                    {/* Budget Group */}
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
                                                    style={{ fontFamily: "'Inter', sans-serif" }}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <span className="text-[10px] font-bold text-emerald-600/60 bg-emerald-50 px-3 py-1.5 rounded-full uppercase tracking-widest shrink-0 whitespace-nowrap">
                                    {processedProducts.length} produits
                                </span>
                            </div>
                        </div>

                        {/* Promo Card */}
                        <div className="hidden lg:flex flex-col justify-between bg-[#1A2E28] rounded-2xl p-6 w-[340px] min-h-[180px] relative overflow-hidden shrink-0 cursor-pointer group">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#C9A96E]/20 via-transparent to-transparent" />
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#C9A96E]/10 rounded-full blur-3xl" />
                            <div className="absolute top-4 right-4 text-[#C9A96E]/10 text-[80px] font-black leading-none pointer-events-none select-none" style={{ fontFamily: "'Playfair Display', serif" }}>"</div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-5 h-px bg-[#C9A96E]/40" />
                                    <span className="text-[7px] font-black uppercase tracking-[0.4em] text-[#C9A96E]">Qualité Garantie</span>
                                </div>
                                <p className="text-white text-[20px] font-bold leading-[1.15]" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                    Achetez<br />chez nous,
                                </p>
                                <p className="text-[#C9A96E] italic font-light text-[16px] mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    livraison express.
                                </p>
                                <p className="text-white/30 text-[9px] mt-3 font-light leading-relaxed max-w-[160px]">
                                    Partout au Maroc sous 48h, emballage premium soigné.
                                </p>
                            </div>

                            <div className="relative z-10 mt-5">
                                <div className="flex items-center gap-3 group-hover:gap-4 transition-all">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-white/40 group-hover:text-[#C9A96E] transition-colors">Commander</span>
                                    <div className="flex-1 h-px bg-white/10 group-hover:bg-[#C9A96E]/40 transition-colors" />
                                    <ArrowRight size={12} className="text-white/20 group-hover:text-[#C9A96E] group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-10">
                        {[...Array(8)].map((_, i) => (
                            <ProductSkeleton key={i} />
                        ))}
                    </div>
                ) : processedProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-40 text-center">
                        <p className="text-xs font-semibold tracking-widest uppercase text-slate-400" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            Aucun produit ne correspond à ces critères
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-10">
                            {displayedProducts.map((product, i) => (
                                <div
                                    key={product.id}
                                    style={{ 
                                        opacity: 0, 
                                        animation: `fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 80}ms forwards` 
                                    }}
                                >
                                    <ProductCard product={product} onQuickView={setSelectedProduct} />
                                </div>
                            ))}
                        </div>

                        {processedProducts.length > 8 && (
                            <div className="mt-20 flex justify-center">
                                <Link 
                                    to="/products" 
                                    className="group relative inline-flex items-center gap-4 px-12 py-5 bg-[#1A1A1A] text-white overflow-hidden rounded-full transition-all duration-500 hover:shadow-2xl hover:shadow-black/20"
                                >
                                    <div className="absolute inset-0 bg-[#C9A96E] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                    <span className="relative z-10 text-[11px] font-black uppercase tracking-[0.3em]">Découvrir la Boutique</span>
                                    <ArrowRightIcon size={16} className="relative z-10 group-hover:translate-x-2 transition-transform duration-500" />
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </div>

            <ProductQuickView product={selectedProduct} onClose={() => setSelectedProduct(null)} />
        </section>
    );
}

