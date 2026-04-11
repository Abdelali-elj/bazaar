
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, ArrowRight, Clock, Star } from 'lucide-react';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Product {
    id: string;
    title: string;
    price: number;
    images: string[];
    slug: string;
    category_id?: string;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [history, setHistory] = useState<string[]>([]);
    const [activeIndex, setActiveIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);

    // Load history on mount
    useEffect(() => {
        const savedHistory = localStorage.getItem('search_history');
        if (savedHistory) setHistory(JSON.parse(savedHistory));
    }, []);

    // Focus input when overlay opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            setSearchQuery('');
            setResults([]);
        }
    }, [isOpen]);

    const [allProducts, setAllProducts] = useState<Product[]>([]);

    // Fetch products once or when needed to allow robust client-side search
    useEffect(() => {
        const fetchInitialProducts = async () => {
            try {
                const q = query(
                    collection(db, "products"),
                    orderBy("title"),
                    limit(100)
                );
                const snapshot = await getDocs(q);
                const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
                setAllProducts(products);
            } catch (err) {
                console.error("Fetch products error:", err);
            }
        };
        if (isOpen) fetchInitialProducts();
    }, [isOpen]);

    // Live Search Logic (Client-side for case-insensitivity)
    useEffect(() => {
        if (searchQuery.length < 1) {
            setResults([]);
            return;
        }

        const queryLower = searchQuery.toLowerCase();
        const filtered = allProducts.filter(p => 
            p.title.toLowerCase().includes(queryLower) || 
            p.category_id?.toLowerCase().includes(queryLower)
        ).slice(0, 6);
        
        setResults(filtered);
    }, [searchQuery, allProducts]);

    const addToHistory = (q: string) => {
        const newHistory = [q, ...history.filter(h => h !== q)].slice(0, 5);
        setHistory(newHistory);
        localStorage.setItem('search_history', JSON.stringify(newHistory));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            setActiveIndex(prev => Math.min(prev + 1, results.length - 1));
        } else if (e.key === 'ArrowUp') {
            setActiveIndex(prev => Math.max(prev - 1, -1));
        } else if (e.key === 'Enter' && activeIndex >= 0) {
            const product = results[activeIndex];
            addToHistory(product.title);
            onClose();
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-xl flex flex-col pt-[10vh] px-4"
                >
                    <div className="max-w-3xl w-full mx-auto">
                        <motion.div 
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="bg-white rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden"
                        >
                            {/* Input Area */}
                            <div className="p-6 md:p-8 flex items-center gap-4 border-b border-slate-100">
                                <Search className="text-[#C9A96E]" size={24} />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    suppressHydrationWarning={true}
                                    placeholder="Rechercher un produit, une marque..."
                                    className="flex-grow bg-transparent border-none outline-none text-xl font-medium text-slate-900 placeholder:text-slate-300"
                                />
                                <button 
                                    onClick={onClose}
                                    className="w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center transition-colors"
                                >
                                    <X size={20} className="text-slate-400" />
                                </button>
                            </div>

                            {/* Results Area */}
                            <div className="max-h-[60vh] overflow-y-auto luxury-scrollbar p-6 md:p-8">
                                {isLoading ? (
                                    <div className="py-12 flex flex-col items-center justify-center gap-4">
                                        <Loader2 className="animate-spin text-[#C9A96E]" size={32} />
                                        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-300">Recherche en cours...</p>
                                    </div>
                                ) : searchQuery.length > 0 ? (
                                    <div className="space-y-8">
                                        {results.length > 0 ? (
                                            <>
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Suggestions</h3>
                                                    <span className="text-[9px] font-bold text-[#C9A96E] uppercase tracking-widest">{results.length} Résultats</span>
                                                </div>
                                                <div className="grid gap-4">
                                                    {results.map((product, idx) => (
                                                        <Link
                                                            key={product.id}
                                                            to={`/fastshop/${product.id}?qty=1`}
                                                            onClick={() => { addToHistory(product.title); onClose(); }}
                                                            className={`flex items-center gap-4 p-3 rounded-2xl transition-all border border-transparent hover:border-[#C9A96E]/20 hover:bg-[#C9A96E]/5 ${activeIndex === idx ? 'bg-[#C9A96E]/10 border-[#C9A96E]/20' : ''}`}
                                                        >
                                                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                                                                <img src={product.images?.[0] || '/placeholder.png'} alt={product.title} className="w-full h-full object-cover" />
                                                            </div>
                                                            <div className="flex-grow">
                                                                <h4 className="text-sm font-bold text-slate-900 mb-0.5">{product.title}</h4>
                                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{product.price} MAD</p>
                                                            </div>
                                                            <ArrowRight size={16} className="text-[#C9A96E] opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </Link>
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="py-12 text-center">
                                                <p className="text-sm font-medium text-slate-400">Aucun produit trouvé pour "{searchQuery}"</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        {history.length > 0 && (
                                            <div>
                                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-4">Recherches Récentes</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {history.map((h, i) => (
                                                        <button
                                                            key={i}
                                                            onClick={() => setSearchQuery(h)}
                                                            className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-[#1A2E28] hover:border-[#C9A96E] hover:text-[#C9A96E] transition-all"
                                                        >
                                                            <Clock size={12} className="opacity-40" />
                                                            {h}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-4">Tendances</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                {['Sérum Hydratant', 'Rouge à lèvres', 'Soin Visage', 'Nouveautés', 'Maquillage Yeux'].map((tag) => (
                                                    <button
                                                        key={tag}
                                                        onClick={() => setSearchQuery(tag)}
                                                        className="text-left px-4 py-3 bg-slate-50/50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 hover:text-black transition-all"
                                                    >
                                                        {tag}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Suggestions Footer */}
                            <div className="bg-slate-50 p-4 flex items-center justify-center">
                                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.4em]">
                                    Appuyez sur <span className="text-slate-400">Esc</span> pour fermer
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
