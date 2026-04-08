"use client";
import React from 'react';
import { TrendingUp, ShoppingBag, ArrowUpRight } from 'lucide-react';

export default function DashboardCharts() {
    // Generate dummy trend data
    const data = [45, 52, 48, 70, 65, 85, 92];
    const maxVal = Math.max(...data);
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Stats Chart (SVG based for zero dependency) */}
            <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 overflow-hidden">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h3 className="text-lg font-black text-slate-900 italic font-playfair">Performance <span className="text-primary italic">Atelier</span></h3>
                        <p className="text-[9px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-1">Évolution des signatures (7 derniers jours)</p>
                    </div>
                    <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl">
                        <TrendingUp size={14} className="text-emerald-600" />
                        <span className="text-[10px] font-black text-emerald-600">+24%</span>
                    </div>
                </div>

                <div className="relative h-48 md:h-64 w-full flex items-end justify-between gap-1.5 md:gap-4 group">
                    {/* Grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5">
                        {[1, 2, 3, 4].map(i => <div key={i} className="w-full h-px bg-slate-900" />)}
                    </div>

                    {data.map((val, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-4 group/bar">
                            <div className="w-full relative flex flex-col justify-end min-h-full">
                                <div 
                                    className="w-full bg-slate-50 border border-slate-100/50 rounded-2xl group-hover/bar:bg-primary transition-all duration-700 ease-out relative overflow-hidden"
                                    style={{ height: `${(val / maxVal) * 100}%` }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                                </div>
                                {/* Value popup on hover */}
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-black px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-all pointer-events-none">
                                    {val} DH
                                </div>
                            </div>
                            <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Jour {i + 1}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Distribution Card */}
            <div className="lg:col-span-4 bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/40 transition-all duration-1000" />
                
                <h3 className="text-lg font-black italic font-playfair mb-8">Canaux <span className="text-primary italic">Directs</span></h3>
                
                <div className="space-y-6 relative z-10">
                    {[
                        { label: "Boutique Web", value: 75, color: "bg-primary" },
                        { label: "Instagram", value: 15, color: "bg-pink-500" },
                        { label: "WhatsApp", value: 10, color: "bg-emerald-500" },
                    ].map((item, i) => (
                        <div key={i} className="space-y-2">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{item.label}</span>
                                <span className="text-[10px] font-black">{item.value}%</span>
                            </div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`} 
                                    style={{ width: `${item.value}%` }} 
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
                    <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Moyenne Panier</p>
                        <span className="text-xl font-black">480 DH</span>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary transition-colors cursor-pointer">
                        <ArrowUpRight size={16} className="text-slate-400 group-hover:text-white" />
                    </div>
                </div>
            </div>
        </div>
    );
}
