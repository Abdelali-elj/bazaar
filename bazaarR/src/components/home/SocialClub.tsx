
import React from 'react';
;
import { Send, Sparkles } from 'lucide-react';

export default function SocialClub() {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="relative overflow-hidden bg-[#1A1A1A] rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.4)] h-full min-h-[500px] flex flex-col lg:flex-row">

                    {/* ── LEFT SIDE: Image Area ── */}
                    <div className="lg:w-1/2 relative min-h-[400px] lg:min-h-full overflow-hidden rounded-r-[40px] z-10">
                        <img
                            src="/club.webp"
                            alt="Social Club"
                            
                            className="object-cover grayscale-[0.2] transition-all duration-1000"
                            
                        />
                        <div className="absolute inset-0 bg-black/40" />
                    </div>

                    {/* ── RIGHT SIDE: Content Area ── */}
                    <div className="lg:w-1/2 p-10 md:p-16 lg:p-20 flex flex-col justify-center relative bg-[#1A1A1A]">
                        {/* Decorative background text */}
                        <div className="absolute bottom-10 right-10 text-[80px] font-black text-white/[0.03] pointer-events-none select-none italic font-playfair leading-none">
                            S. Club
                        </div>

                        <div className="space-y-8 relative z-10 animate-fade-up">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="w-8 h-[1px] bg-[#C9A96E]" />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#C9A96E]">
                                        Rejoignez l'Élite
                                    </span>
                                </div>
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair italic text-white leading-tight font-light">
                                    Bazaar <span className="text-[#C9A96E]">Social Club</span>
                                </h2>
                                <p className="text-white/50 font-sans font-light leading-relaxed max-w-md">
                                    Accédez en avant-première à nos nouvelles formules, rituels secrets et invitations exclusives. Pas de spam, juste l'excellence.
                                </p>
                            </div>

                            <form
                                className="relative mt-12 overflow-hidden rounded-full border border-white/10 bg-white/5 p-1 group focus-within:ring-2 focus-within:ring-[#C9A96E]/20 transition-all duration-500"
                                onSubmit={(e) => e.preventDefault()}
                                suppressHydrationWarning={true}
                            >
                                <input
                                    type="email"
                                    placeholder="votre@email.com"
                                    suppressHydrationWarning={true}
                                    className="w-full bg-transparent py-4 px-6 text-sm font-sans focus:outline-none placeholder:text-white/20 text-white"
                                />
                                <button className="absolute right-1 top-1 bottom-1 px-8 rounded-full bg-[#C9A96E] text-white flex items-center gap-2 hover:bg-white hover:text-black transition-all duration-500 active:scale-95 shadow-xl">
                                    <span className="text-[10px] font-black uppercase tracking-widest">S'inscrire</span>
                                    <Send size={14} strokeWidth={1.5} />
                                </button>
                            </form>

                            <div className="pt-4 flex items-center gap-6">
                                <p className="text-[9px] uppercase font-black tracking-widest text-[#C9A96E]">Inspirations</p>
                                <span className="w-1 h-1 rounded-full bg-white/10" />
                                <p className="text-[9px] uppercase font-black tracking-widest text-[#C9A96E]">Conseils</p>
                                <span className="w-1 h-1 rounded-full bg-white/10" />
                                <p className="text-[9px] uppercase font-black tracking-widest text-[#C9A96E]">Privilèges</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
