
import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Heart, Star, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/components/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { Product } from '@/lib/types';
import { useActiveOffer } from '@/components/ActiveOfferContext';
import { useNavigate as useRouter } from "react-router-dom";

interface ProductQuickViewProps {
    product: Product | null;
    onClose: () => void;
}

export default function ProductQuickView({ product, onClose }: ProductQuickViewProps) {
    const { addItem } = useCart();
    const { toggleFavorite, isFavorite } = useFavorites();
    const { calculateDiscountedPrice, activeOffer } = useActiveOffer();
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const router = useRouter();

    useEffect(() => {
        if (product) {
            document.body.style.overflow = 'hidden';
            setQuantity(1);
            setActiveImage(0);
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [product]);

    if (!product) return null;

    const favorited = isFavorite(product.id);
    const images = product.images?.length > 0 
        ? product.images 
        : ['https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=1000'];

    const originalPrice = Number(product.price) || 0;
    const price = calculateDiscountedPrice(originalPrice, product.id);
    const hasDiscount = price < originalPrice;

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            title: product.title,
            price: price,
            image: images[0],
            quantity: quantity
        } as any);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-500"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div 
                className="relative w-full max-w-6xl bg-white rounded-[1.5rem] md:rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-[0_40px_100px_rgba(0,0,0,0.2)] animate-in zoom-in-95 fade-in duration-500 max-h-[98vh] md:max-h-[92vh] border border-slate-100"
            >
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 z-50 w-10 h-10 rounded-full bg-white/90 hover:bg-[#1A2E28] text-slate-400 hover:text-white flex items-center justify-center transition-all duration-300 shadow-md"
                >
                    <X size={18} />
                </button>

                {/* Left: Hero Image (Full Width of column with internal padding for floating effect) */}
                <div className="w-full md:w-1/2 p-2 md:p-10 relative group">
                    <div className="w-full h-[160px] md:h-full relative rounded-[1rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl">
                        <img 
                            src={images[activeImage]} 
                            alt={product.title}
                            className="w-full h-full object-cover animate-in fade-in duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent group-hover:from-black/30 transition-all duration-500" />
                        
                        {/* Navigation Arrows */}
                        {images.length > 1 && (
                            <>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1)); }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-11 md:h-11 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center hover:bg-white hover:text-[#1A2E28] transition-all duration-300 z-20 group/nav"
                                >
                                    <ChevronLeft size={20} className="group-hover/nav:scale-110 transition-transform" />
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1)); }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-11 md:h-11 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center hover:bg-white hover:text-[#1A2E28] transition-all duration-300 z-20 group/nav"
                                >
                                    <ChevronRight size={20} className="group-hover/nav:scale-110 transition-transform" />
                                </button>
                            </>
                        )}
                        
                        {/* Minimal Thumbnail Overlay - Always visible on mobile, hover on desktop */}
                        {images.length > 1 && (
                            <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 p-1.5 md:p-2 bg-black/20 md:bg-white/20 backdrop-blur-md rounded-full border border-white/30 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-20 overflow-x-auto max-w-[90%] no-scrollbar">
                                {images.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={(e) => { e.stopPropagation(); setActiveImage(idx); }}
                                        className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-300 shrink-0 ${
                                            activeImage === idx 
                                            ? 'bg-white w-4 md:w-6' 
                                            : 'bg-white/40'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Content (Professional refinement) */}
                <div className="w-full md:w-1/2 p-3 md:p-16 flex flex-col justify-center bg-white">
                    <div className="space-y-2 md:space-y-8">
                        {/* Tag */}
                        <span className="hidden md:inline-block text-[10px] font-black uppercase tracking-[0.4em] text-[#C9A96E]">Exclusivité Bazaar</span>

                        {/* Title - Smaller & Clean */}
                        <h2 className="text-xl md:text-5xl font-bold text-[#1A2E28] leading-tight font-outfit">
                            {product.title}
                        </h2>

                        {/* Pricing - Compact */}
                        <div className="flex items-center gap-2 md:gap-8">
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl md:text-6xl font-black text-[#1A2E28] tracking-tighter font-outfit">
                                    {price.toLocaleString('fr-FR')}
                                </span>
                                <span className="text-sm font-bold text-[#1A2E28] uppercase tracking-widest">DH</span>
                                {hasDiscount && (
                                    <span className="ml-3 text-sm font-black text-white bg-red-600 px-3 py-1 rounded-md shadow-sm border border-red-500">
                                        {activeOffer?.price?.includes('%') ? activeOffer.price : `-${originalPrice - price} DH`}
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col">
                                 <span className="text-sm text-slate-400 line-through font-medium">
                                     {hasDiscount ? originalPrice.toLocaleString('fr-FR') + ' DH' : ''}
                                 </span>
                                 <span className="text-[9px] font-black text-rose-500 uppercase tracking-tighter">
                                     {hasDiscount ? activeOffer?.badge : ''}
                                 </span>
                            </div>
                        </div>

                        {/* Description - Hidden on small mobile to save vertical space */}
                        <div className="hidden sm:block space-y-2 md:space-y-4">
                            <div className="flex items-center gap-2 md:gap-3">
                                <div className="h-px w-6 md:w-8 bg-[#C9A96E]" />
                                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#1A2E28]/40">Détails</span>
                            </div>
                            <p className="text-[#1A2E28]/50 text-[13px] md:text-[15px] leading-snug md:leading-relaxed max-w-md line-clamp-2 md:line-clamp-3"
                               dangerouslySetInnerHTML={{ 
                                   __html: product.description?.replace(/<[^>]*>/g, '') || "Une pièce maîtresse alliant design contemporain et savoir-faire traditionnel."
                               }}
                            />
                        </div>

                        {/* Controls */}
                        <div className="space-y-2 md:space-y-8 pt-0.5 md:pt-4">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center bg-slate-50/50 rounded-lg md:rounded-xl p-0.5 md:p-1 border border-slate-100">
                                    <button 
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-8 md:w-12 h-8 md:h-12 flex items-center justify-center text-slate-400 hover:text-[#1A2E28] transition-all text-base font-light"
                                    >—</button>
                                    <span className="w-6 md:w-10 text-center text-xs md:text-base font-bold text-[#1A2E28] font-outfit">{quantity}</span>
                                    <button 
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-8 md:w-12 h-8 md:h-12 flex items-center justify-center text-slate-400 hover:text-[#1A2E28] transition-all text-base font-light"
                                    >+</button>
                                </div>
                                <button
                                    onClick={() => toggleFavorite(product.id)}
                                    className={`w-9 md:w-14 h-9 md:h-14 rounded-lg md:rounded-xl border flex items-center justify-center transition-all ${
                                        favorited 
                                        ? 'bg-rose-50 border-rose-100 text-rose-500 shadow-sm' 
                                        : 'bg-white border-slate-100 text-slate-300 hover:text-[#1A2E28] shadow-sm'
                                    }`}
                                >
                                    <Heart size={16} fill={favorited ? 'currentColor' : 'none'} strokeWidth={1.5} />
                                </button>
                            </div>

                            {/* Dual Buttons - Perfectly Balanced */}
                            <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 py-2.5 md:py-5 bg-white text-[#1A2E28] border-2 border-[#1A2E28] rounded-xl flex items-center justify-center gap-2 md:gap-3 hover:bg-slate-50 transition-all duration-300 active:scale-[0.98] group"
                                >
                                    <ShoppingBag size={14} className="md:w-[18px]" />
                                    <span className="text-[8px] md:text-[11px] font-bold uppercase tracking-[0.2em] font-outfit">Panier</span>
                                </button>
                                <button
                                    onClick={() => router(`/fastshop/${product.id}?qty=${quantity}`)}
                                    className="flex-1 py-2.5 md:py-5 bg-[#1A2E28] text-white rounded-xl flex items-center justify-center gap-2 md:gap-3 hover:bg-[#1A2E28]/90 hover:shadow-xl transition-all duration-300 active:scale-[0.99] group shadow-lg"
                                >
                                    <span className="text-[8px] md:text-[11px] font-bold uppercase tracking-[0.2em] font-outfit">Acheter Directement</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            
        </div>
    );
}
