import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Headset, Rocket, Users, ShieldCheck, ChevronDown } from "lucide-react";

import ProductSection from "@/components/products/ProductSection";
import Recommendations from "@/components/products/Recommendations";
import OffersSection from "@/components/home/OffersSection";
import MarqueeStrip from "@/components/home/MarqueeStrip";
import GoldenVideoSection from "@/components/home/GoldenVideoSection";
import CommentsSection from "@/components/home/CommentsSection";
import SocialClub from "@/components/home/SocialClub";
import ConciergeSection from "@/components/home/ConciergeSection";
import WaveDivider from "@/components/ui/WaveDivider";

export default function Home() {
    const [animKey, setAnimKey] = useState(0);

    useEffect(() => {
        const handleRefresh = () => {
            setAnimKey(prev => prev + 1);
        };
        window.addEventListener('refreshHome', handleRefresh);
        return () => window.removeEventListener('refreshHome', handleRefresh);
    }, []);

    return (
        <main 
            key={animKey}
            id="home" 
            className={`min-h-screen w-full overflow-x-hidden relative bg-black ${animKey > 0 ? 'animate-fade-up duration-1000' : ''}`}
        >
            {/* Hero Section */}
            <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0 scale-105">
                    <img
                        src="/bg1.webp"
                        alt="Background"
                        className="w-full h-full object-cover object-center hidden md:block"
                    />
                    <img
                        src="/bg2.webp"
                        alt="Background Mobile"
                        className="w-full h-full object-cover object-center md:hidden"
                    />
                </div>
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] z-10" />

                <section className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center pt-20">
                    <div className="space-y-3 md:space-y-5 lg:space-y-6 animate-fade-up">
                        <span className="text-white/60 text-[8px] md:text-[9px] lg:text-[10px] font-black uppercase tracking-[0.5em] block pt-4 md:pt-8">
                            Excellence Professionnelle en Beauté & Hair
                        </span>
                        <div className="space-y-2 md:space-y-4">
                            <h1 className="font-playfair text-white font-light leading-[1.05] text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[4.8rem] tracking-tight pt-2">
                                Sublimez Votre <br />
                                <span className="italic text-white/80">Style Unique</span>
                            </h1>
                            <div className="space-y-3">
                                <p className="text-white/60 text-[10px] md:text-xs lg:text-sm max-w-lg mx-auto leading-relaxed font-light tracking-wide px-4">
                                    L'expertise du soin capillaire haut de gamme et des équipements de prestige. <br className="hidden md:block" />
                                    Une collection exclusive pour les professionnels les plus exigeants.
                                </p>
                                {/* Modern Social Proof Badge with User SVGs */}
                                <div className="inline-flex items-center gap-4 bg-white/[0.03] backdrop-blur-2xl border border-white/10 px-5 py-2 rounded-full animate-fade-up hover:bg-white/[0.06] transition-all cursor-default group shadow-2xl">
                                    <div className="flex -space-x-3.5">
                                        {[
                                            { bg: "bg-[#4285F4]", icon: Users },
                                            { bg: "bg-[#34A853]", icon: ShieldCheck },
                                            { bg: "bg-[#FBBC05]", icon: Star },
                                            { bg: "bg-[#A142F4]", icon: Rocket }
                                        ].map((item, i) => (
                                            <div
                                                key={i}
                                                className={`w-7 h-7 rounded-full border-2 border-white ${item.bg} flex items-center justify-center group-hover:-translate-y-1 transition-all duration-500 shadow-lg`}
                                                style={{ transitionDelay: `${i * 50}ms`, zIndex: 4 - i }}
                                            >
                                                <item.icon size={12} className="text-white" strokeWidth={2} />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex flex-col items-start gap-0">
                                        <div className="flex items-center gap-0.5 mb-0.5">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star key={s} size={10} fill="#FBBC05" className="text-[#FBBC05] drop-shadow-[0_0_8px_rgba(251,188,5,0.4)]" />
                                            ))}
                                        </div>
                                        <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/80 leading-tight">
                                            <span className="text-white font-black">+700</span> avis vérifiés
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center gap-4 md:gap-6 lg:gap-8 mt-2 relative z-20">
                            <a href="#shop" className="group relative overflow-hidden bg-white text-black px-8 py-3.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                                <span className="relative z-10 flex items-center gap-2">
                                    Découvrir la Boutique
                                    <ArrowRight size={12} strokeWidth={1} className="group-hover:translate-x-1 transition-transform duration-500" />
                                </span>
                            </a>
                            <a href="#about" className="text-white/40 hover:text-white transition-all text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] group relative py-2">
                                Notre Histoire
                                <div className="absolute bottom-0 left-0 w-6 h-[1px] bg-white/20 group-hover:w-full transition-all duration-500" />
                            </a>
                        </div>

                        {/* Luxury Trust Indicators Refined */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center justify-center pt-10 md:pt-14 border-t border-white/10 max-w-4xl mx-auto">
                            {[
                                { icon: Users, val: "5000+", label: "Clientes Satisfaites" },
                                { icon: Rocket, val: "48H", label: "Livraison au Maroc" },
                                { icon: ShieldCheck, val: "100%", label: "Produits Certifiés" },
                                { icon: Headset, val: "24/7", label: "Support Expert" }
                            ].map((item, i) => (
                                <div key={i} className="group flex flex-col items-center gap-3 px-4 py-5 text-center transition-all duration-500 hover:bg-white/[0.05] hover:-translate-y-2 rounded-[2rem] border border-transparent hover:border-white/10 bg-white/[0.01] relative overflow-hidden">
                                    {/* Background Glow */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-[#C9A96E]/5 blur-[60px] rounded-full group-hover:bg-[#C9A96E]/20 transition-all duration-700" />
                                    
                                    <div className="relative z-10 w-12 h-12 rounded-full bg-white/5 backdrop-blur-md border border-white/5 flex items-center justify-center group-hover:bg-[#C9A96E]/20 group-hover:scale-110 transition-all duration-700 shadow-[0_0_20px_rgba(201,169,110,0.1)] group-hover:shadow-[0_0_30px_rgba(201,169,110,0.3)]">
                                        <item.icon size={20} strokeWidth={1} className="text-[#C9A96E]" />
                                    </div>
                                    <div className="relative z-10 space-y-1.5">
                                        <div className="text-white text-xl md:text-2xl font-playfair font-semibold tracking-tight group-hover:text-[#C9A96E] transition-colors">{item.val}</div>
                                        <div className="text-white/40 text-[8px] md:text-[9px] uppercase tracking-[0.25em] font-black leading-tight">{item.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Animated Scroll Indicator */}
                <a
                    href="#shop"
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 animate-bounce-slow cursor-pointer group z-20"
                >
                    <span className="text-white/20 text-[7px] md:text-[8px] font-black uppercase tracking-[0.4em] group-hover:text-white/60 transition-colors duration-700">
                        Scroll
                    </span>
                    <div className="relative flex items-center justify-center">
                        <ChevronDown size={24} strokeWidth={1} className="text-white/10 group-hover:text-white/60 transition-all duration-700" />
                        <div className="absolute inset-0 bg-white/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    </div>
                </a>
            </div>

            {/* ── Black Marquee Strip ── */}
            <MarqueeStrip />

            {/* ── Offers Carousel ── */}
            <OffersSection />

            {/* ── Product Section ── */}
            <div id="shop">
                <ProductSection />
            </div>

            {/* ── Golden Video Section ── */}
            <div className="bg-[#121212] relative">
                <WaveDivider color="black" height="h-[20px] md:h-[40px]" />
                <GoldenVideoSection />
            </div>

            {/* ── Concierge Section ── */}
            <ConciergeSection />

            {/* ── Comments Section ── */}
            <CommentsSection />

            {/* ── Social Club Newsletter ── */}
            <SocialClub />
        </main>
    );
}
