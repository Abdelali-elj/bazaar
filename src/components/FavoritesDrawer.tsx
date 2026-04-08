"use client";
import React, { useEffect, useState } from 'react';
import { X, Heart, Trash2, ShoppingBag, Loader2 } from 'lucide-react';
import { useFavorites } from '@/context/FavoritesContext';
import { useCart } from '@/components/CartContext';
import { getProducts } from '@/lib/actions/products';
import { Product } from '@/lib/types';

export default function FavoritesDrawer() {
    const { favorites, isFavoritesOpen, setIsFavoritesOpen, toggleFavorite } = useFavorites();
    const { addItem } = useCart();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isFavoritesOpen && favorites.length > 0) {
            setLoading(true);
            getProducts().then(allProducts => {
                const favProducts = (allProducts || []).filter((p: any) => favorites.includes(p.id));
                setProducts(favProducts);
                setLoading(false);
            }).catch(err => {
                console.error(err);
                setLoading(false);
            });
        }
    }, [isFavoritesOpen, favorites]);

    useEffect(() => {
        if (isFavoritesOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isFavoritesOpen]);

    if (!isFavoritesOpen) return null;

    const handleMoveToCart = (product: Product) => {
        addItem({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.images?.[0] || '',
        });
        // Optional: remove from favorites after adding to cart?
        // toggleFavorite(product.id);
    };

    return (
        <div className="fixed inset-0 z-[200] flex justify-end">
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
                onClick={() => setIsFavoritesOpen(false)}
            />

            <div className="relative h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-left">
                {/* Header */}
                <div className="p-8 flex items-center justify-between border-b border-gray-50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white">
                            <Heart size={20} fill="currentColor" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold tracking-tight">Vos Favoris</h2>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
                                {favorites.length} {favorites.length > 1 ? 'articles' : 'article'} sauvegardés
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsFavoritesOpen(false)}
                        className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center gap-4">
                            <Loader2 className="animate-spin text-gray-200" size={32} />
                            <span className="text-[10px] font-bold tracking-widest uppercase text-gray-300">Mise à jour de votre liste...</span>
                        </div>
                    ) : products.length > 0 ? (
                        <div className="space-y-8">
                            {products.map((product) => (
                                <div key={product.id} className="flex gap-6 animate-fade-in">
                                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 border border-black/5 flex-shrink-0">
                                        <img src={product.images?.[0]} alt={product.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-grow space-y-3">
                                        <div className="flex justify-between items-start gap-4">
                                            <h3 className="text-[13px] font-bold text-gray-900 leading-snug line-clamp-2">
                                                {product.title}
                                            </h3>
                                            <button 
                                                onClick={() => toggleFavorite(product.id)}
                                                className="text-rose-500 hover:scale-110 transition-transform"
                                            >
                                                <Heart size={16} fill="currentColor" />
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="text-[14px] font-bold text-black">
                                                {product.price.toLocaleString()} DH
                                            </div>
                                            <button 
                                                onClick={() => handleMoveToCart(product)}
                                                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:text-rose-500 transition-colors"
                                            >
                                                <ShoppingBag size={14} />
                                                Ajouter au panier
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                                <Heart size={32} strokeWidth={1} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-md font-bold text-gray-400 uppercase tracking-widest">Aucun favori</h3>
                                <p className="text-[10px] text-gray-300 uppercase tracking-widest leading-relaxed">
                                    Enregistrez les produits que vous aimez <br /> pour les retrouver plus tard.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
