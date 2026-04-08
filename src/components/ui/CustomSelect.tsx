"use client";
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';

interface Option {
    id: string;
    name: string;
    image_url?: string | null;
}

interface CustomSelectProps {
    options: Option[];
    value: string | null;
    onChange: (id: string | null) => void;
    placeholder: string;
    className?: string;
    label?: string;
    error?: string;
}

export default function CustomSelect({ options, value, onChange, placeholder, className = "", label, error }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(o => o.id === value);
    const filteredOptions = options.filter(o => 
        o.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Reset search when opening/closing
    useEffect(() => {
        if (!isOpen) setSearchTerm("");
    }, [isOpen]);

    return (
        <div ref={containerRef} className={`relative flex flex-col gap-2 ${className}`}>
            {label && (
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">
                    {label}
                </label>
            )}

            {/* Trigger */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`group w-full bg-white border ${
                    isOpen ? 'border-[#1A2E28] ring-4 ring-[#1A2E28]/5' : 
                    error ? 'border-rose-300 ring-4 ring-rose-500/5' : 
                    'border-[#E8E3DB] hover:border-[#1A2E28]/30'
                } rounded-xl px-5 py-4 text-sm font-medium text-[#1A2E28] flex items-center justify-between transition-all duration-300 shadow-sm`}
            >
                <div className="flex items-center gap-3">
                    {selectedOption?.image_url && (
                        <div className="w-6 h-6 rounded-lg overflow-hidden border border-[#E8E3DB] shrink-0 bg-slate-50">
                            <img src={selectedOption.image_url} className="w-full h-full object-cover" alt="" />
                        </div>
                    )}
                    <span className={!selectedOption ? 'text-slate-300' : 'text-[#1A2E28]'}>
                        {selectedOption ? selectedOption.name : placeholder}
                    </span>
                </div>
                <ChevronDown 
                    size={16} 
                    className={`text-slate-300 group-hover:text-[#1A2E28] transition-transform duration-500 ${isOpen ? 'rotate-180 text-[#1A2E28]' : ''}`} 
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-[100] top-full left-0 w-full mt-2 bg-white border border-[#E8E3DB] rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in zoom-in-95 duration-300 origin-top">
                    {/* Search Field for long lists */}
                    {options.length > 8 && (
                        <div className="p-3 border-b border-slate-50 relative">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Rechercher..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                suppressHydrationWarning={true}
                                className="w-full bg-slate-50/50 rounded-lg py-2.5 pl-9 pr-4 text-xs font-medium focus:outline-none focus:bg-white border border-transparent focus:border-slate-100 transition-all"
                            />
                        </div>
                    )}

                    <div className="max-h-[250px] overflow-y-auto luxury-scrollbar p-1.5">
                        {filteredOptions.length === 0 ? (
                            <div className="px-4 py-8 text-center text-slate-300 text-[10px] font-bold uppercase tracking-widest">
                                Aucun résultat
                            </div>
                        ) : (
                            filteredOptions.map((option) => (
                                <button
                                    key={option.id}
                                    type="button"
                                    className={`w-full text-left px-4 py-3.5 rounded-xl text-[11px] font-bold tracking-wider uppercase transition-all flex items-center justify-between group/opt ${
                                        value === option.id 
                                        ? 'bg-[#1A2E28] text-white shadow-lg shadow-[#1A2E28]/20' 
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-[#1A2E28]'
                                    }`}
                                    onClick={() => {
                                        onChange(option.id);
                                        setIsOpen(false);
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        {option.image_url && (
                                            <div className="w-7 h-7 rounded-lg overflow-hidden border border-[#E8E3DB] shrink-0 bg-slate-50 group-hover/opt:border-[#1A2E28]/20 transition-colors">
                                                <img src={option.image_url} className="w-full h-full object-cover" alt="" />
                                            </div>
                                        )}
                                        <span>{option.name}</span>
                                    </div>
                                    {value === option.id && <Check size={14} className="text-white animate-in zoom-in duration-300" />}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}

            {error && <p className="text-[10px] font-bold text-rose-500 mt-1 ml-1">{error}</p>}
        </div>
    );
}
