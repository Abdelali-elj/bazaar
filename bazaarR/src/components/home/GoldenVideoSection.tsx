
import React from 'react';
import { ArrowRight, Leaf } from 'lucide-react';
import { Link } from "react-router-dom";

const TICKER_ITEMS = [
    "L'Art de la Perfection", "Collection Golden", "Bazaar Style",
    "Édition Limitée", "Soins Professionnels", "Beauté & Hair", "100% Authentique",
];

export default function GoldenVideoSection() {
    return (
        <section
            className="overflow-hidden relative"
            style={{ background: '#121212' }}
        >
            {/* subtle radial bg */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        'radial-gradient(ellipse 60% 50% at 70% 50%, rgba(201,169,110,0.1) 0%, transparent 70%)',
                }}
            />

            {/* ── MAIN GRID ── */}
            <div
                className="max-w-6xl mx-auto px-12 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center"
            >

                {/* ── LEFT: TEXT ── */}
                <div className="space-y-0 relative z-10">

                    {/* unified title layout */}
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left mb-10 w-full">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="hidden lg:block w-12 h-px bg-[#C9A96E]/50" />
                            <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#C9A96E]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                Signature Bazaar Style
                            </span>
                            <div className="w-12 h-px bg-[#C9A96E]/50" />
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal leading-[1.1] tracking-tight" style={{ fontFamily: "'Playfair Display', serif", color: '#FFFFFF' }}>
                            L'Art de la <br />
                            <span className="italic text-[#C9A96E]">Perfection.</span>
                        </h2>
                    </div>

                    {/* descriptions */}
                    <p
                        className="leading-relaxed mb-3"
                        style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: '15px',
                            fontWeight: 300,
                            color: 'rgba(255,255,255,0.6)',
                            maxWidth: '400px',
                        }}
                    >
                        Chaque pièce de notre collection "Golden" est conçue pour sublimer votre éclat
                        naturel. Nous croyons que la beauté réside dans les détails et l'excellence du
                        mouvement.
                    </p>
                    <p
                        className="leading-relaxed mb-9"
                        style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: '13px',
                            fontWeight: 300,
                            color: 'rgba(255,255,255,0.4)',
                            maxWidth: '380px',
                        }}
                    >
                        Découvrez comment nos produits transforment la routine quotidienne en une
                        expérience luxueuse et professionnelle, inspirée par les plus grands ateliers
                        de mode.
                    </p>

                    {/* stats */}
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-8 mb-11 text-center lg:text-left">
                        {[
                            { num: '100%', label: 'Authentique' },
                            { num: 'Premium', label: 'Qualité Or' },
                            { num: '+700', label: 'Avis Vérifiés' },
                        ].map(({ num, label }, i) => (
                            <React.Fragment key={i}>
                                {i > 0 && (
                                    <div className="hidden sm:block" style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' }} />
                                )}
                                <div className="min-w-[80px]">
                                    <p
                                        style={{
                                            fontFamily: "'Playfair Display', serif",
                                            fontSize: 'clamp(24px, 5vw, 30px)',
                                            fontWeight: 400,
                                            color: '#FFFFFF',
                                            lineHeight: 1,
                                        }}
                                    >
                                        {num}
                                    </p>
                                    <p
                                        style={{
                                            fontFamily: "'DM Sans', sans-serif",
                                            fontSize: 'clamp(8px, 2vw, 9px)',
                                            fontWeight: 500,
                                            letterSpacing: '0.2em',
                                            textTransform: 'uppercase',
                                            color: 'rgba(255,255,255,0.4)',
                                            marginTop: '4px',
                                        }}
                                    >
                                        {label}
                                    </p>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>

                    {/* CTAs */}
                    <div className="flex items-center gap-5">
                        <Link
                            to="/products"
                            className="flex items-center gap-2.5 rounded-full transition-all"
                            style={{
                                padding: '14px 28px',
                                background: '#C9A96E',
                                color: '#FFFFFF',
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize: '11px',
                                fontWeight: 500,
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLAnchorElement).style.filter = 'brightness(1.1)';
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLAnchorElement).style.filter = 'none';
                            }}
                        >
                            Voir la collection
                            <ArrowRight size={13} strokeWidth={2} />
                        </Link>

                        <button
                            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                            className="rounded-full transition-all"
                            style={{
                                padding: '13px 24px',
                                background: 'none',
                                border: '0.5px solid rgba(255,255,255,0.2)',
                                color: 'rgba(255,255,255,0.6)',
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize: '11px',
                                fontWeight: 400,
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLButtonElement).style.borderColor = '#FFFFFF';
                                (e.currentTarget as HTMLButtonElement).style.color = '#FFFFFF';
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.2)';
                                (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.6)';
                            }}
                        >
                            Notre Histoire
                        </button>
                    </div>
                </div>

                {/* ── RIGHT: VIDEO ── */}
                <div className="relative z-10">
                    {/* video card */}
                    <div
                        className="relative overflow-hidden group"
                        style={{
                            borderRadius: '24px',
                            aspectRatio: '4/5',
                            boxShadow: '0 40px 80px rgba(26,26,26,0.12)',
                            zIndex: 1,
                        }}
                    >
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        >
                            <source src="/golden.mp4" type="video/mp4" />
                        </video>

                        {/* gradient overlay */}
                        <div
                            className="absolute inset-0"
                            style={{
                                background:
                                    'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
                            }}
                        />

                        {/* Inner Frame - 6mm/24px inset, thin border between gold and grey */}
                        <div
                            className="absolute inset-6 z-20 pointer-events-none border-[0.5px] opacity-40 rounded-xl"
                            style={{ borderColor: '#B8A594' }}
                        />

                        {/* BOTTOM: Professional Badge centered */}
                        <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center">
                            <div
                                className="flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md"
                                style={{
                                    background: 'rgba(201, 169, 110, 0.15)',
                                    border: '0.5px solid #C9A96E',
                                    color: '#C9A96E',
                                    fontFamily: "'DM Sans', sans-serif",
                                    fontSize: '10px',
                                    fontWeight: 600,
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase',
                                }}
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] animate-pulse" />
                                <span>Professionnel • Qualité Studio</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── TICKER ── */}
            <div
                className="overflow-hidden mt-20"
                style={{ background: '#1A1A1A', padding: '18px 0' }}
            >
                <div
                    className="flex whitespace-nowrap"
                    style={{ animation: 'tickerRoll 18s linear infinite' }}
                >
                    {[...Array(4)].flatMap(() => TICKER_ITEMS).map((item, i) => (
                        <span
                            key={i}
                            className="flex items-center"
                            style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                fontSize: '15px',
                                fontStyle: 'italic',
                                fontWeight: 300,
                                color: 'rgba(245,240,232,0.35)',
                                padding: '0 32px',
                                gap: '20px',
                            }}
                        >
                            <span
                                style={{
                                    display: 'inline-block',
                                    width: '4px',
                                    height: '4px',
                                    borderRadius: '50%',
                                    background: '#C9A96E',
                                    opacity: 0.5,
                                    marginRight: '20px',
                                    flexShrink: 0,
                                }}
                            />
                            {item}
                        </span>
                    ))}
                </div>
            </div>

            <style jsx global>{`
        @keyframes tickerRoll {
          from { transform: translateX(0) }
          to   { transform: translateX(-50%) }
        }
        @keyframes floatBadge {
          0%, 100% { transform: translateY(0) }
          50%       { transform: translateY(-6px) }
        }
      `}</style>
        </section>
    );
}