
import React from 'react';
;
import { ArrowRight, CheckCircle2, History, Package, ShieldCheck, Users } from 'lucide-react';
import { Link } from "react-router-dom";

export default function AboutUsSection() {
    return (
        <section id="about" className="relative w-full py-24 md:py-32 bg-[#FCFBF9] overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
                <div className="grid lg:grid-cols-2 gap-20 items-center">

                    {/* ─── LEFT SIDE: OVERLAPPING IMAGE COLLAGE ─── */}
                    <div className="relative pb-36 md:pb-12 pr-20 md:pr-12">
                        <div className="relative z-10">
                            {/* Main Background Image + Badge */}
                            <div className="w-[78%] aspect-[4/3] rounded-[32px] md:rounded-[40px] overflow-visible shadow-2xl border-4 md:border-8 border-white relative group mx-auto md:mx-0 md:ml-[-3rem]">
                                <img
                                    src="/s1.webp"
                                    
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110 rounded-[28px] md:rounded-[32px]"
                                    alt="Professional Beauty Atelier"
                                    
                                />

                                {/* Experience Badge — sticks to right edge */}
                                <div className="absolute top-[40%] -translate-y-1/2 -right-[4.8rem] sm:-right-[4.7rem] md:-right-[5.5rem] z-30 bg-[#1A2E28] text-[#C9A96E] p-3 md:p-5 rounded-[14px] md:rounded-[18px] shadow-2xl min-w-[90px] md:min-w-[120px] transform rotate-3 hover:rotate-0 transition-all duration-500 cursor-default">
                                    <div className="flex flex-col gap-0.5 items-start text-left">
                                        <span className="text-base md:text-2xl font-black leading-none" style={{ fontFamily: "'Outfit', sans-serif" }}>10ans FIX</span>
                                        <span className="text-[6px] md:text-[8px] font-bold uppercase tracking-[0.12em] leading-tight text-white/50">Années d'Excellence <br /> & Expertise</span>
                                    </div>
                                </div>
                            </div>

                            {/* Overlapping Secondary Image — same layout on all screens */}
                            <div className="absolute -bottom-28 md:-bottom-40 -right-10 md:-right-10 w-[73%] aspect-[4/3] rounded-[24px] md:rounded-[32px] overflow-hidden shadow-2xl border-4 md:border-8 border-white z-20 hover:scale-105 transition-transform duration-700 group">
                                <img
                                    src="/s2.webp"
                                    
                                    className="object-cover"
                                    alt="Our Craftsmanship"
                                    
                                />
                            </div>


                        </div>

                        {/* Decorative Pistachio Element */}
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#A7C957]/10 rounded-full blur-3xl -z-10" />
                    </div>

                    {/* ─── RIGHT SIDE: CONTENT ─── */}
                    <div className="space-y-10 lg:pl-10">
                        <div className="flex flex-col items-center lg:items-start text-center lg:text-left mb-10 w-full">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="hidden lg:block w-12 h-px bg-[#C9A96E]/50" />
                                <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#C9A96E]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    Notre Maison
                                </span>
                                <div className="w-12 h-px bg-[#C9A96E]/50" />
                            </div>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal leading-[1.1] tracking-tight" style={{ fontFamily: "'Playfair Display', serif", color: '#1A2E28' }}>
                                L'Art de la Beauté, <br />
                                <span className="italic text-[#C9A96E]">Sans Compromis.</span>
                            </h2>
                        </div>

                        <p className="text-[17px] text-slate-600 leading-relaxed font-light max-w-xl">
                            Depuis plus d'une décennie, Bazaar Style s'impose comme la référence incontournable au Maroc pour les professionnels de la coiffure et de l'esthétique. Nous sélectionnons avec passion des équipements et produits de prestige pour sublimer chaque geste technique.
                        </p>

                        {/* Services/Features List (2 Cols) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { title: "Produits Certifiés", desc: "Qualité salon garantie" },
                                { title: "Service Conciergerie", desc: "Accompagnement dédié" },
                                { title: "Innovation Continue", desc: "Dernières technologies" },
                                { title: "Livraison de Luxe", desc: "Soin et rapidité" }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-start gap-4 group">
                                    <div className="w-6 h-6 rounded-full bg-[#C9A96E]/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#C9A96E]/20 transition-colors">
                                        <CheckCircle2 size={14} className="text-[#C9A96E]" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <h4 className="text-[14px] font-bold text-[#1A2E28] leading-none group-hover:text-[#C9A96E] transition-colors">{item.title}</h4>
                                        <p className="text-[12px] text-slate-400 font-medium tracking-tight">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Action Group */}
                        <div className="flex flex-col sm:flex-row items-center gap-6 pt-6">
                            <Link to="/products" className="w-full sm:w-auto px-10 py-5 bg-[#C9A96E] text-white rounded-full text-[11px] font-black uppercase tracking-[0.3em] overflow-hidden group relative shadow-[0_20px_40px_rgba(201,169,110,0.3)] hover:shadow-[#C9A96E]/40 transition-all active:scale-95 inline-flex items-center justify-center">
                                <span className="relative z-10 flex items-center gap-2">
                                    Découvrir Notre Boutique
                                    <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-500" />
                                </span>
                                <div className="absolute inset-0 bg-[#1A2E28] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ─── BOTTOM STATS BAR ─── */}
                <div className="mt-20 md:mt-40 grid grid-cols-2 lg:grid-cols-4 bg-[#1A2E28] rounded-[32px] md:rounded-[48px] overflow-hidden shadow-2xl border border-white/5 relative">
                    {/* Background Texture/Light */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#A7C957]/5 blur-[100px]" />

                    {[
                        { label: "Catégories Elite", val: "24+", icon: Package },
                        { label: "Produits en Stock", val: "5K+", icon: Users },
                        { label: "Marques Partenaires", val: "80+", icon: ShieldCheck },
                        { label: "Années d'Histoire", val: "10", icon: History }
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className={`p-6 md:p-14 flex flex-col items-center lg:items-start gap-4 border-white/5 transition-all duration-500 hover:bg-white/[0.02] group ${i !== 3 ? 'border-b lg:border-b-0 lg:border-r' : ''
                                }`}
                        >
                            <div className="w-12 h-12 rounded-2xl backdrop-blur-xl bg-white/15 shadow-xl flex items-center justify-center text-[#A7C957] group-hover:scale-110 transition-transform duration-500 border border-white/20">
                                <stat.icon size={24} strokeWidth={1.5} />
                            </div>
                            <div className="space-y-1 text-center lg:text-left">
                                <span className="text-3xl md:text-5xl font-black text-white tracking-tighter" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                    {stat.val}
                                </span>
                                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 block">
                                    {stat.label}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}