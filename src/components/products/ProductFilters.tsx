"use client";
import React, { useState } from 'react';
import { Search, ChevronDown, Filter, X, SlidersHorizontal, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductFiltersProps {
    categories: any[];
    selectedCategory: string | null;
    setSelectedCategory: (id: string | null) => void;
    priceRange: [number, number];
    setPriceRange: (range: [number, number]) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

import CustomSelect from '@/components/ui/CustomSelect';

export default function ProductFilters({
    categories,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    searchQuery,
    setSearchQuery
}: ProductFiltersProps) {
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
    const [localPrice, setLocalPrice] = useState(priceRange[1]);

    const sortOptions = [
        { id: "pertinence", name: "PERTINENCE" },
        { id: "prix-croissant", name: "PRIX CROISSANT" },
        { id: "prix-decroissant", name: "PRIX DÉCROISSANT" },
        { id: "nouveautes", name: "NOUVEAUTÉS" },
    ];

    const handleClearAll = () => {
        setSearchQuery('');
        setSelectedCategory(null);
        setPriceRange([0, 10000]);
        setLocalPrice(10000);
    };

    return (
        <div className="w-full mb-12">
            {/* Desktop & Tablet Filter Bar */}
            <div 
                className="bg-white/80 backdrop-blur-xl border border-[#EDEAE4] rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-3 md:p-4 flex items-center justify-between gap-4"
                style={{ fontFamily: "'Jost', sans-serif" }}
            >
                {/* Search Input Container */}
                <div className="relative flex-grow flex items-center bg-[#FAF9F6] rounded-2xl border border-[#F5F2ED] focus-within:border-[#C9A96E] transition-all group px-4 py-3">
                    <Search className="text-[#C5C2BC] group-focus-within:text-[#C9A96E] transition-colors" size={18} strokeWidth={1.5} />
                    <input
                        type="text"
                        placeholder="RECHERCHER DANS LA COLLECTION..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent border-none text-[11px] font-bold tracking-[0.2em] uppercase text-[#1A1A1A] placeholder-[#C5C2BC] focus:outline-none focus:ring-0 ml-3"
                    />
                    {searchQuery && (
                        <button 
                            onClick={() => setSearchQuery('')}
                            className="p-1 hover:bg-white rounded-full transition-colors text-[#C5C2BC] hover:text-[#1A1A1A]"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* Mobile Filter Toggle */}
                <button 
                    onClick={() => setIsMobileDrawerOpen(true)}
                    className="md:hidden w-12 h-12 rounded-2xl bg-[#1A2E28] text-white flex items-center justify-center shadow-lg active:scale-95 transition-all"
                >
                    <SlidersHorizontal size={20} />
                </button>

                {/* Desktop Filters Group */}
                <div className="hidden md:flex items-center gap-3">
                    {/* Category Select */}
                    <CustomSelect 
                        options={categories.map(c => ({ id: c.id, name: c.name }))}
                        value={selectedCategory}
                        onChange={setSelectedCategory}
                        placeholder="CATÉGORIES"
                    />

                    {/* Price Range Slider (Inline Desktop) */}
                    <div className="relative group">
                        <button className="h-12 px-6 rounded-2xl border border-[#F5F2ED] bg-[#FAF9F6] flex items-center gap-3 hover:border-[#C9A96E] transition-all">
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1A1A1A]">PRIX</span>
                            <ChevronDown size={14} className="text-[#C9A96E]" />
                        </button>
                        <div className="absolute top-full right-0 mt-3 p-6 bg-white rounded-3xl border border-[#EDEAE4] shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-40 min-w-[280px]">
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Maximum</span>
                                    <span className="text-sm font-bold text-[#1A2E28]">{localPrice} DH</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="2000" 
                                    step="50"
                                    value={localPrice}
                                    onChange={(e) => {
                                        setLocalPrice(Number(e.target.value));
                                        setPriceRange([0, Number(e.target.value)]);
                                    }}
                                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#C9A96E]"
                                />
                                <div className="flex justify-between text-[9px] font-bold text-slate-300">
                                    <span>0 DH</span>
                                    <span>2000 DH</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sort */}
                    <CustomSelect 
                        options={sortOptions}
                        value={null}
                        onChange={() => {}}
                        placeholder="TRIER PAR"
                    />
                </div>
            </div>

            {/* Selection Pill Tray */}
            {(selectedCategory || searchQuery || priceRange[1] < 10000) && (
                <div className="flex flex-wrap items-center gap-2 mt-6 transition-all duration-300">
                    <span className="text-[9px] font-bold text-[#C5C2BC] uppercase tracking-[0.2em] mr-2 ml-4">Filtres :</span>
                    
                    {searchQuery && (
                        <Pill label={`"${searchQuery}"`} onClear={() => setSearchQuery('')} />
                    )}
                    {selectedCategory && (
                        <Pill 
                            label={categories.find(c => c.id === selectedCategory)?.name || 'Catégorie'} 
                            onClear={() => setSelectedCategory(null)} 
                        />
                    )}
                    {priceRange[1] < 10000 && (
                        <Pill 
                            label={`Max ${priceRange[1]} DH`} 
                            onClear={() => { setPriceRange([0, 10000]); setLocalPrice(10000); }} 
                        />
                    )}

                    <button 
                        onClick={handleClearAll}
                        className="text-[9px] font-bold text-[#C9A96E] uppercase tracking-[0.2em] hover:text-[#1A1A1A] transition-colors ml-2 bg-[#C9A96E]/5 px-3 py-1 rounded-full border border-transparent hover:border-[#C9A96E]/20"
                    >
                        Réinitialiser
                    </button>
                </div>
            )}

            {/* Mobile Filter Drawer (Sheet) */}
            <AnimatePresence>
                {isMobileDrawerOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileDrawerOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] md:hidden"
                        />
                        <motion.div 
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[3rem] z-[70] p-8 md:hidden shadow-[0_-20px_50px_rgba(0,0,0,0.2)] border-t border-slate-100"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-lg font-playfair font-bold text-[#1A2E28]">Filtres Avançés</h2>
                                <button onClick={() => setIsMobileDrawerOpen(false)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-10">
                                {/* Categories Section */}
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Catégories</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {categories.map((cat) => (
                                            <button
                                                key={cat.id}
                                                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                                                className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                                                    selectedCategory === cat.id 
                                                        ? 'bg-[#C9A96E] text-white shadow-lg' 
                                                        : 'bg-slate-50 text-slate-400 border border-slate-100'
                                                }`}
                                            >
                                                {cat.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Section */}
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Gamme de Prix</h3>
                                        <span className="text-sm font-bold text-[#1A2E28]">{localPrice} DH</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="2000" 
                                        step="50"
                                        value={localPrice}
                                        onChange={(e) => {
                                            setLocalPrice(Number(e.target.value));
                                            setPriceRange([0, Number(e.target.value)]);
                                        }}
                                        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#C9A96E]"
                                    />
                                    <div className="flex justify-between text-[9px] font-bold text-slate-300">
                                        <span>0 DH</span>
                                        <span>2000 DH</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => setIsMobileDrawerOpen(false)}
                                    className="w-full py-5 bg-[#C9A96E] text-white rounded-3xl font-bold uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-[#C9A96E]/20 active:scale-95 transition-all"
                                >
                                    Appliquer les filtres
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

function Pill({ label, onClear }: { label: string, onClear: () => void }) {
    return (
        <div className="px-4 py-1.5 bg-white border border-[#EDEAE4] rounded-full flex items-center gap-3">
            <span className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-widest">{label}</span>
            <button onClick={onClear} className="text-[#C5C2BC] hover:text-[#E11D48] transition-colors">
                <X size={12} />
            </button>
        </div>
    );
}
