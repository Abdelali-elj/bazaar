
import React, { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, query, onSnapshot, getDoc, doc } from 'firebase/firestore';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate as useRouter } from "react-router-dom";
import ProductQuickView from '@/components/products/ProductQuickView';
import OfferModal from '@/components/OfferModal';
import { useActiveOffer } from '@/components/ActiveOfferContext';

const BADGE_COLORS: Record<string, string> = {
    GRATUIT: '#16a34a',
    PROMO: '#B8965A',
    EXCLUSIF: '#1A1A1A',
    NOUVEAU: '#4A5C4A',
    LIVRAISON: '#0ea5e9',
};

const FALLBACK_IMAGES = [
    'https://images.unsplash.com/photo-1527799822367-474857a3f447?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=2000&auto=format&fit=crop',
];

const MOCK_OFFERS = [
    {
        id: 'mock-1',
        title: 'Pack Renaissance Capillaire',
        description: "Une cure complète pour restaurer la vitalité et l'éclat de vos cheveux.",
        price: '850 DH',
        badge: 'PROMO',
        active: true,
        imageUrl: FALLBACK_IMAGES[0],
    },
    {
        id: 'mock-2',
        title: 'Sérum Éclat Ultime',
        description: 'Brillance miroir et protection thermique professionnelle pour tous types.',
        price: '420 DH',
        badge: 'NOUVEAU',
        active: true,
        imageUrl: FALLBACK_IMAGES[1],
    },
    {
        id: 'mock-3',
        title: 'Coffret Soin Prestige',
        description: "L'alliance parfaite des soins capillaires haut de gamme en édition limitée.",
        price: '1 200 DH',
        badge: 'EXCLUSIF',
        active: true,
        imageUrl: FALLBACK_IMAGES[2],
    },
];

export default function OffersSection() {
    const [offers, setOffers] = useState<any[]>([]);
    const [current, setCurrent] = useState(0);
    const [animating, setAnimating] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [selectedGlobalOffer, setSelectedGlobalOffer] = useState<any>(null);
    const [loadingOfferId, setLoadingOfferId] = useState<string | null>(null);
    const router = useRouter();
    const { claimOffer } = useActiveOffer();

    const handleAction = async (e: React.MouseEvent, offer: any) => {
        e.preventDefault();
        claimOffer(offer.id);
        if (offer.type === 'specific_promo' || offer.type === 'product_addon') {
            if (offer.product_id) {
                setLoadingOfferId(offer.id);
                try {
                    const pDoc = await getDoc(doc(db, 'products', offer.product_id));
                    if (pDoc.exists()) {
                        setSelectedProduct({ id: pDoc.id, ...pDoc.data() });
                    }
                } finally {
                    setLoadingOfferId(null);
                }
            }
        } else {
            setSelectedGlobalOffer(offer);
        }
    };

    /* ── Firebase sync ── */
    useEffect(() => {
        try {
            const unsub = onSnapshot(query(collection(db, 'offers')), (snap) => {
                if (snap.empty) { setOffers(MOCK_OFFERS); return; }
                const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                const active = data.filter((o: any) => o.active === true);
                setOffers(active.length > 0 ? active : MOCK_OFFERS);
            }, () => setOffers(MOCK_OFFERS));
            return () => unsub();
        } catch { setOffers(MOCK_OFFERS); }
    }, []);

    /* ── Navigation ── */
    const goTo = useCallback((n: number) => {
        if (animating || offers.length < 2) return;
        setAnimating(true);
        setTimeout(() => { setCurrent(n); setAnimating(false); }, 350);
    }, [animating, offers.length]);

    const next = useCallback(
        () => goTo((current + 1) % offers.length),
        [goTo, current, offers.length],
    );
    const prev = useCallback(
        () => goTo((current - 1 + offers.length) % offers.length),
        [goTo, current, offers.length],
    );

    /* ── Auto-rotate 7s ── */
    useEffect(() => {
        if (offers.length < 2) return;
        const t = setInterval(next, 7000);
        return () => clearInterval(t);
    }, [next, offers.length]);

    if (offers.length === 0) return null;

    const visible =
        offers.length === 1
            ? [offers[0]]
            : [offers[current], offers[(current + 1) % offers.length]];

    return (
        <section className="w-full px-6 py-16 lg:px-12" style={{ backgroundColor: '#ffffffff' }}>

            {/* ── Header ── */}
            <div className="flex flex-col items-center text-center mb-16 w-full relative">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-px bg-[#C9A96E]/50" />
                    <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#C9A96E]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        Offres Exclusives
                    </span>
                    <div className="w-12 h-px bg-[#C9A96E]/50" />
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal leading-[1.1] tracking-tight" style={{ fontFamily: "'Playfair Display', serif", color: '#1A2E28' }}>
                    Sélection <br className="md:hidden" />
                    <span className="italic text-[#C9A96E]">du Moment</span>
                </h2>
                {offers.length > 2 && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:flex gap-2">
                        {([{ fn: prev, Icon: ArrowLeft }, { fn: next, Icon: ArrowRight }] as const).map(
                            ({ fn, Icon }, i) => (
                                <button
                                    key={i}
                                    onClick={fn}
                                    className="w-10 h-10 rounded-full border flex items-center justify-center transition-all"
                                    style={{ borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)' }}
                                    onMouseEnter={e => {
                                        const b = e.currentTarget as HTMLButtonElement;
                                        b.style.background = '#C9A96E';
                                        b.style.color = 'white';
                                        b.style.borderColor = '#C9A96E';
                                    }}
                                    onMouseLeave={e => {
                                        const b = e.currentTarget as HTMLButtonElement;
                                        b.style.background = 'rgba(255,255,255,0.05)';
                                        b.style.color = 'rgba(255,255,255,0.6)';
                                        b.style.borderColor = 'rgba(255,255,255,0.1)';
                                    }}
                                >
                                    <Icon size={15} strokeWidth={1.5} />
                                </button>
                            ),
                        )}
                    </div>
                )}
            </div>

            {/* ── Cards grid ── */}
            <div
                className={`grid gap-5 ${offers.length > 1 ? 'md:grid-cols-2' : 'grid-cols-1'}`}
                style={{
                    transition: 'opacity 0.35s, transform 0.35s',
                    opacity: animating ? 0 : 1,
                    transform: animating ? 'translateX(12px)' : 'translateX(0)',
                }}
            >
                {visible.map((offer, idx) => {
                    const badgeColor = BADGE_COLORS[offer.badge] ?? '#C9A96E';
                    // Always resolve an image — use offer's own, or cycle through fallbacks
                    const imgSrc: string =
                        offer.imageUrl || FALLBACK_IMAGES[(current + idx) % FALLBACK_IMAGES.length];

                    return (
                        <div
                            key={`${offer.id}-${idx}`}
                            className="relative group overflow-hidden flex flex-col justify-end min-h-[260px] md:min-h-[400px]"
                            style={{ borderRadius: '20px' }}
                        >
                            {/* ── Background image — ALWAYS present on both cards ── */}
                            <img
                                src={imgSrc}
                                alt={offer.title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />

                            {/* ── Dark gradient overlay ── */}
                            <div
                                className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-95"
                                style={{
                                    background:
                                        'linear-gradient(to top, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.45) 55%, rgba(10,10,10,0.05) 100%)',
                                }}
                            />



                            {/* ── Card content ── */}
                            <div className="relative z-10 p-5 md:p-10 space-y-3 md:space-y-5">

                                {/* Badge */}
                                {offer.badge && (
                                    <span
                                        className="inline-flex items-center gap-2 text-white text-[9px] font-semibold tracking-[0.3em] uppercase px-3 py-1.5"
                                        style={{
                                            backgroundColor: badgeColor,
                                            borderRadius: '6px',
                                            fontFamily: "'DM Sans', sans-serif",
                                        }}
                                    >
                                        <span
                                            style={{
                                                width: 5,
                                                height: 5,
                                                borderRadius: '50%',
                                                background: 'rgba(255,255,255,0.5)',
                                                display: 'inline-block',
                                                flexShrink: 0,
                                            }}
                                        />
                                        {offer.badge}
                                    </span>
                                )}

                                {/* Title + description */}
                                <div className="space-y-2">
                                    <h3
                                        style={{
                                            fontFamily: "'Playfair Display', serif",
                                            fontSize: 'clamp(26px, 2.4vw, 40px)',
                                            fontStyle: 'italic',
                                            fontWeight: 400,
                                            lineHeight: 1.1,
                                            color: '#fff',
                                        }}
                                    >
                                        {offer.title}
                                    </h3>
                                    {offer.description && (
                                        <p
                                            className="text-sm font-light max-w-sm leading-relaxed"
                                            style={{ color: 'rgba(255,255,255,0.6)', fontFamily: "'DM Sans', sans-serif" }}
                                        >
                                            {offer.description}
                                        </p>
                                    )}
                                </div>

                                {/* Price + CTA */}
                                <div
                                    className="flex items-center justify-between pt-6 relative"
                                >
                                    {/* Premium Divider Line */}
                                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-white/5 via-white/20 to-white/5" />
                                    <div>
                                        <span
                                            className="block text-[9px] uppercase tracking-widest mb-1"
                                            style={{ color: 'rgba(255,255,255,0.35)', fontFamily: "'DM Sans', sans-serif" }}
                                        >
                                            Offre Spéciale
                                        </span>
                                        <span
                                            className="text-3xl font-semibold text-white"
                                            style={{ fontFamily: "'Playfair Display', serif" }}
                                        >
                                            {offer.price}
                                        </span>
                                    </div>

                                    <button
                                        onClick={(e) => handleAction(e, offer)}
                                        disabled={loadingOfferId === offer.id}
                                        className="flex items-center justify-center gap-2.5 text-[10px] font-medium uppercase tracking-widest text-white disabled:opacity-50"
                                        style={{
                                            padding: '12px 20px',
                                            borderRadius: '12px',
                                            background: 'rgba(255,255,255,0.1)',
                                            border: '1px solid rgba(255,255,255,0.15)',
                                            backdropFilter: 'blur(8px)',
                                            fontFamily: "'DM Sans', sans-serif",
                                            textDecoration: 'none',
                                            transition: 'background 0.2s, border-color 0.2s',
                                        }}
                                        onMouseEnter={e => {
                                            if (loadingOfferId !== offer.id) {
                                                const el = e.currentTarget as HTMLButtonElement;
                                                el.style.background = '#C9A96E';
                                                el.style.borderColor = '#C9A96E';
                                            }
                                        }}
                                        onMouseLeave={e => {
                                            if (loadingOfferId !== offer.id) {
                                                const el = e.currentTarget as HTMLButtonElement;
                                                el.style.background = 'rgba(255,255,255,0.1)';
                                                el.style.borderColor = 'rgba(255,255,255,0.15)';
                                            }
                                        }}
                                    >
                                        {loadingOfferId === offer.id ? (
                                            <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
                                        ) : (
                                            <>
                                                Profiter de l&apos;offre
                                                <ArrowRight size={13} strokeWidth={2} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── Dot indicators ── */}
            <div className="flex justify-center gap-1.5 mt-7">
                {offers.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        style={{
                            height: '2px',
                            width: i === current ? '40px' : '24px',
                            background: i === current ? '#C9A96E' : 'rgba(255,255,255,0.1)',
                            border: 'none',
                            borderRadius: '999px',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            padding: 0,
                        }}
                    />
                ))}
            </div>

            <ProductQuickView product={selectedProduct} onClose={() => setSelectedProduct(null)} />
            <OfferModal offer={selectedGlobalOffer} onClose={() => setSelectedGlobalOffer(null)} />
        </section>
    );
}