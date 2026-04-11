
import React from 'react';
import { ShoppingCart, Heart, Eye, Star, MapPin, ArrowRight, Droplets, Layout, Zap, Truck } from 'lucide-react';
import { useCart } from '@/components/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { Product } from '@/lib/types';
import { Link } from "react-router-dom";
import { useActiveOffer } from '@/components/ActiveOfferContext';

import { useNavigate as useRouter } from "react-router-dom";

interface ProductCardProps {
    product: Product;
    onQuickView: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
    const router = useRouter();
    const { addItem } = useCart();
    const { toggleFavorite, isFavorite } = useFavorites();
    const { calculateDiscountedPrice, activeOffer } = useActiveOffer();
    const favorited = isFavorite(product.id);

    const imageUrl =
        product.images?.[0] ||
        'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=1000';

    const originalPrice = Number(product.price) || 0;
    const price = calculateDiscountedPrice(originalPrice, product.id);
    const hasDiscount = price < originalPrice;
    
    const collectionName = (product as any).categories?.name || 'Vente';
    
    const isNew = (product as any).is_featured || (product.id.length % 5 === 0);
    const discount = hasDiscount ? activeOffer?.badge : null;

    // Summary "Features" based on product data (Simulated)
    const features = [
        { icon: Droplets, label: "100ml" },
        { icon: Layout, label: "Tout type" },
        { icon: Zap, label: "Pro" }
    ];

    const handleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleFavorite(product.id);
    };

    return (
        <div
            className="group flex flex-col bg-white rounded-[24px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden relative"
            style={{ fontFamily: "'Inter', sans-serif" }}
        >
            {/* ─── IMAGE CONTAINER ─── */}
            <div className="relative p-2 md:p-3">
                <div className="relative aspect-[4/3] rounded-[14px] md:rounded-[18px] overflow-hidden bg-slate-50 shadow-inner">
                    {/* Badges — hidden on mobile */}
                    <div className="absolute top-3 left-3 z-10 hidden md:block">
                        <span className="px-3 py-1.5 text-[10px] font-bold bg-white/90 backdrop-blur-md text-slate-900 rounded-lg shadow-sm border border-slate-100 flex items-center gap-1.5">
                            <Star size={10} className="-yellow-400 text-yellow-400" />
                            {isNew ? 'Premium' : collectionName}
                        </span>
                    </div>

                    {/* Wishlist Button */}
                    <button
                        onClick={handleFavorite}
                        className={`absolute top-3 right-3 z-30 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md shadow-lg active:scale-90 ${
                            favorited 
                            ? 'bg-rose-500 text-white' 
                            : 'bg-white/80 text-slate-400 hover:text-rose-500 hover:bg-white'
                        }`}
                    >
                        <Heart 
                            size={18} 
                            fill={favorited ? 'currentColor' : 'none'}
                            strokeWidth={2}
                            className={favorited ? 'animate-heart' : ''}
                        />
                    </button>

                    {/* Main Image */}
                    <img
                        src={imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        onError={(e) => {
                             (e.target as any).style.display = 'none';
                             (e.target as any).parentElement.style.background = 'linear-gradient(45deg, #f8f9fa, #fff)';
                        }}
                    />

                    {/* Quick View Overlay (Centered prominence) */}
                    <div 
                        className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20 cursor-pointer"
                        onClick={() => onQuickView(product)}
                    >
                        <div className="w-14 h-14 bg-white/90 backdrop-blur-md text-[#1a2e28] rounded-full flex items-center justify-center shadow-2xl transform translate-y-10 group-hover:translate-y-0 transition-transform duration-500 hover:bg-[#C9A96E] hover:text-white group/eye">
                            <Eye size={24} className="group-hover/eye:scale-110 transition-transform" />
                            <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[10px] font-black text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Voir Plus</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── PRODUCT INFO ─── */}
            <div className="px-2.5 md:px-6 pb-4 md:pb-6 pt-1 md:pt-2 flex flex-col flex-1">
                {/* Category & Signature Meta */}
                <div className="flex flex-col gap-0 mb-1">
                    <div className="flex items-center gap-1 text-slate-400 text-[8px] md:text-[10px] uppercase font-bold tracking-widest">
                        <MapPin size={8} className="text-[#C9A96E]" />
                        <span className="truncate">{collectionName}</span>
                    </div>
                </div>

                {/* Title */}
                <div className="mb-1 min-h-[2.2rem] md:min-h-[3rem]">
                    <h3 className="text-[13px] md:text-[18px] font-bold text-slate-900 leading-tight line-clamp-2 group-hover:text-[#C9A96E] transition-colors">
                        {product.title}
                    </h3>
                </div>

                {/* Star Rating Row */}
                <div className="flex flex-col gap-0 pt-1 md:pt-3 mb-1 md:mb-3 border-t border-slate-50">
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star 
                                key={s} 
                                size={10} 
                                className="-[#C9A96E] text-[#C9A96E]" 
                                strokeWidth={0}
                            />
                        ))}
                        <span className="text-[9px] md:text-[10px] font-bold text-slate-400 ml-1 mt-0.5 tracking-widest">(4.9)</span>
                    </div>
                </div>

                {/* Price & Action Row */}
                <div className="mt-auto flex flex-col pt-1 md:pt-3 border-t border-slate-50 gap-1.5 md:gap-3">
                    <div className="flex flex-col">
                        {/* Old price — always shown above current price on mobile */}
                        <span className="text-[10px] md:hidden font-medium text-slate-300 line-through decoration-slate-300/50 leading-none mb-0.5">
                            {originalPrice.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} DH
                        </span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                             <span className="text-[16px] md:text-[20px] font-bold text-slate-900 leading-none tracking-tighter">
                                {price.toLocaleString('fr-FR')} <span className="text-[10px] md:text-sm">DH</span>
                            </span>
                            {hasDiscount && (
                                <span className="text-[11px] font-black text-white bg-red-600 px-2 py-0.5 rounded-md shadow-sm border border-red-500">
                                    {activeOffer?.price?.includes('%') ? activeOffer.price : `-${originalPrice - price} DH`}
                                </span>
                            )}
                        </div>
                        {discount && !hasDiscount && (
                            <span className="text-[10px] font-black text-[#C9A96E] uppercase tracking-widest mt-1">Offre Spéciale</span>
                        )}
                        {hasDiscount && (
                            <span className="text-[9px] md:text-[10px] font-black text-red-500 uppercase tracking-widest mt-0.5">{activeOffer?.badge || 'PROMO'}</span>
                        )}
                    </div>

                    {/* Trust Badges - Luxe Minimalist */}
                    <div className="flex flex-wrap items-center gap-1.5">
                        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50/50 border border-emerald-100/50">
                            <Truck size={10} className="text-emerald-600" />
                            <span className="text-[8px] font-black text-emerald-700 uppercase tracking-tight">Livraison 24/48h</span>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-50 border border-slate-100">
                             <div className="w-2.5 h-2.5 rounded-full bg-slate-200 flex items-center justify-center text-[10px]">
                                <span className="scale-[0.6]">💵</span>
                             </div>
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-tight">Paiement à la Livraison</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    addItem({
                                        id: product.id,
                                        title: product.title,
                                        price: price,
                                        image: imageUrl
                                    });
                                }}
                                className="w-9 md:w-12 h-10 md:h-14 bg-white text-[#1a2e28] border border-slate-200 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-slate-50 hover:border-[#1a2e28] active:scale-95 group/btn shrink-0"
                                title="Ajouter au Panier"
                            >
                            <ShoppingCart size={14} className="group-hover/btn:scale-110 transition-transform" />
                        </button>
                        
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                router(`/fastshop/${product.id}?qty=1`);
                            }}
                            className="flex-1 flex items-center justify-center gap-1.5 px-2 h-10 md:h-14 bg-[#1a2e28] text-white rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-widest transition-all duration-300 hover:bg-[#C9A96E] hover:shadow-xl hover:shadow-[#C9A96E]/20 active:scale-95 group/fast"
                        >
                            <Zap size={10} className="-[#C9A96E] text-[#C9A96E] group-hover/fast:scale-110 transition-transform" />
                            <span>Acheter</span>
                        </button>
                    </div>
                </div>
            </div>
            
            
        </div>
    );
}
