
import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, query, limit, getDocs, where } from 'firebase/firestore';
import { Link } from "react-router-dom";
import { ShoppingBag, Star, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../CartContext';
import { MOCK_PRODUCTS } from '@/lib/mockData';
import { Product as ProductType } from '@/lib/types';

interface Product {
    id: string;
    title: string;
    price: number;
    images: string[];
    slug: string;
    rating?: number;
}

export default function Recommendations({ currentProductId }: { currentProductId?: string }) {
    const [products, setProducts] = useState<Product[]>([]);
    const { addItem, setIsCartOpen } = useCart();

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const q = query(
                    collection(db, "products"),
                    limit(8)
                );
                const snapshot = await getDocs(q);
                let fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
                
                if (fetched.length === 0) {
                    fetched = MOCK_PRODUCTS;
                }

                // Simple recommendation logic: exclude fixed product if provided
                if (currentProductId) {
                    fetched = fetched.filter(p => p.id !== currentProductId);
                }
                
                setProducts(fetched);
            } catch (err) {
                console.error("Error fetching recommendations:", err);
                setProducts(MOCK_PRODUCTS.filter(p => p.id !== currentProductId));
            }
        };

        fetchRecommendations();
    }, [currentProductId]);

    if (products.length === 0) return null;

    return (
        <section className="py-24 bg-[#FCFBF9] overflow-hidden">
            <div className="max-w-[90rem] mx-auto px-6 lg:px-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#C9A96E]/10 flex items-center justify-center">
                                <Sparkles className="text-[#C9A96E]" size={20} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C9A96E]">Intelligence Beauté</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-playfair font-medium text-[#1A2E28]">Produits Pour Vous</h2>
                        <p className="text-slate-400 text-sm max-w-md font-medium">Une sélection personnalisée basée sur vos préférences et les tendances du moment.</p>
                    </div>
                </div>

                <div className="flex gap-6 overflow-x-auto pb-8 luxury-scrollbar snap-x snap-mandatory h-auto">
                    {products.map((product, idx) => (
                        <motion.div 
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="min-w-[280px] md:min-w-[320px] bg-white rounded-[2.5rem] border border-[#F2EBE1] p-4 group snap-center hover:shadow-2xl transition-all duration-700"
                        >
                            <Link to={`/fastshop/${product.id}?qty=1`} className="block relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-6 bg-slate-50">
                                <img 
                                    src={product.images?.[0] || '/placeholder.png'} 
                                    alt={product.title} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                />
                                <div className="absolute top-4 left-4">
                                    <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                                        <Star size={10} fill="#C9A96E" color="#C9A96E" />
                                        <span className="text-[9px] font-black text-[#1A2E28] uppercase tracking-widest">Favori</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        addItem({ id: product.id, title: product.title, price: product.price, image: product.images[0] });
                                        setIsCartOpen(true);
                                    }}
                                    className="absolute bottom-4 right-4 w-12 h-12 rounded-2xl bg-[#1A2E28] text-white flex items-center justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 shadow-xl active:scale-95"
                                >
                                    <ShoppingBag size={20} strokeWidth={1.5} />
                                </button>
                            </Link>

                            <div className="px-2 pb-2">
                                <h3 className="text-[13px] font-black text-[#1A2E28] uppercase tracking-widest mb-2 line-clamp-1">{product.title}</h3>
                                <div className="flex items-center justify-between">
                                    <span className="text-xl font-playfair font-bold text-[#C9A96E]">{product.price} DH</span>
                                    <Link to={`/fastshop/${product.id}?qty=1`} className="text-[9px] font-black text-slate-300 uppercase tracking-widest hover:text-[#1A2E28] transition-colors flex items-center gap-2">
                                        Commander
                                        <ArrowRight size={12} />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
