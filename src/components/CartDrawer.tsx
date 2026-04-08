"use client";
import React, { useEffect, useState } from 'react';
import { X, ShoppingBag, Trash2, ArrowRight, Loader2 } from 'lucide-react';
import { useCart } from './CartContext';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartDrawer() {
    const { items, totalPrice, isCartOpen, setIsCartOpen, removeItem, updateQuantity } = useCart();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isCartOpen]);

    if (!isMounted) return null;

    return (
        <AnimatePresence>
            {isCartOpen && (
                <div className="fixed inset-0 z-[200]">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setIsCartOpen(false)}
                    />

                    {/* Drawer Content */}
                    <motion.div 
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-8 flex items-center justify-between border-b border-gray-50">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white">
                                    <ShoppingBag size={20} strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold tracking-tight">Votre Panier</h2>
                                    <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
                                        {items.length} {items.length > 1 ? 'articles' : 'article'} sélectionnés
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsCartOpen(false)}
                                className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Shipping Progress Bar */}
                        {items.length > 0 && (
                            <div className="px-8 py-4 bg-[#FAF9F6] border-b border-gray-100">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        {totalPrice >= 500 
                                            ? "LIVRAISON OFFERTE ✨" 
                                            : `PLUS QUE ${(500 - totalPrice).toLocaleString()} DH POUR LA LIVRAISON OFFERTE`}
                                    </span>
                                    <span className="text-[10px] font-black text-[#C9A96E]">
                                        {Math.min(100, (totalPrice / 500) * 100).toFixed(0)}%
                                    </span>
                                </div>
                                <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-[#C9A96E] transition-all duration-1000 ease-out"
                                        style={{ width: `${Math.min(100, (totalPrice / 500) * 100)}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Items List */}
                        <div className="flex-grow overflow-y-auto p-8 luxury-scrollbar">
                            {items.length > 0 ? (
                                <div className="space-y-8">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-6 group animate-fade-in">
                                            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 border border-black/5">
                                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-grow space-y-3">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="text-[13px] font-bold text-gray-900 leading-snug line-clamp-2">
                                                        {item.title}
                                                    </h3>
                                                    <button 
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-gray-300 hover:text-rose-500 transition-colors p-1"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center bg-gray-50 rounded-lg p-0.5 border border-black/5 scale-90 origin-left">
                                                        <button 
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="w-8 h-8 flex items-center justify-center font-bold hover:text-black transition-colors"
                                                        >-</button>
                                                        <span className="w-6 text-center text-[11px] font-bold">{item.quantity}</span>
                                                        <button 
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="w-8 h-8 flex items-center justify-center font-bold hover:text-black transition-colors"
                                                        >+</button>
                                                    </div>
                                                    <div className="text-[14px] font-bold text-black">
                                                        {item.price.toLocaleString()} DH
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                                        <ShoppingBag size={32} strokeWidth={1} />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-md font-bold text-gray-400 uppercase tracking-widest">Le panier est vide</h3>
                                        <p className="text-[10px] text-gray-300 uppercase tracking-widest">
                                            Commencez vos achats pour voir <br /> apparaître vos coups de cœur.
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => setIsCartOpen(false)}
                                        className="px-8 py-4 bg-black text-white rounded-xl text-[10px] font-bold tracking-widest uppercase hover:bg-gray-900 transition-all"
                                    >
                                        Explorer la boutique
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-8 border-t border-gray-50 bg-gray-50/50 space-y-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Estimation</span>
                                    <span className="text-2xl font-bold text-black">{totalPrice.toLocaleString()} DH</span>
                                </div>
                                <div className="space-y-3">
                                    <Link 
                                        href="/checkout" 
                                        onClick={() => setIsCartOpen(false)}
                                        className="w-full py-5 bg-black text-white rounded-2xl text-[11px] font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-3 hover:bg-gray-900 transition-all shadow-xl shadow-black/10 group"
                                    >
                                        COMMANDER MAINTENANT
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <p className="text-[9px] text-center text-gray-400 uppercase tracking-widest font-medium">
                                        Livraison gratuite au Maroc dès 500 DH d'achat
                                    </p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
