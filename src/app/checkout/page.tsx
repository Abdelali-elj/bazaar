"use client";
import { useCart } from "@/components/CartContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2, ArrowRight, ShoppingBag, Wallet, CheckCircle2, Ticket, X, Copy, ChevronDown } from "lucide-react";
import CustomSelect from "@/components/ui/CustomSelect";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export default function CheckoutPage() {
    const { cart, totalPrice, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [successData, setSuccessData] = useState<{ fullName: string, total: number, orderId: string, trackingCode: string } | null>(null);
    const router = useRouter();

    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        customCity: "",
        notes: "",
    });
    const [user, setUser] = useState<any>(null);
    const [isCustomCity, setIsCustomCity] = useState(false);

    const [promoCodeInput, setPromoCodeInput] = useState("");
    const [appliedPromo, setAppliedPromo] = useState<{ 
        code: string, 
        discount: number, 
        type: 'fixed' | 'percentage',
        productIds?: string[] | null,
        usageLimit?: number | null,
        timesUsed?: number
    } | null>(null);
    const [promoError, setPromoError] = useState("");
    const [applyingPromo, setApplyingPromo] = useState(false);

    // Calculate sum of eligible products if restricted
    const eligibleTotal = appliedPromo?.productIds 
        ? cart.filter(item => appliedPromo.productIds?.includes(item.id))
              .reduce((sum, item) => sum + (item.price * item.quantity), 0)
        : totalPrice;

    const discountAmount = appliedPromo 
        ? (appliedPromo.type === 'percentage' ? (eligibleTotal * appliedPromo.discount / 100) : appliedPromo.discount) 
        : 0;

    const finalPrice = Math.max(0, totalPrice - discountAmount);

    const MOROCCAN_CITIES = [
        "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir", "Meknès", 
        "Oujda", "Kenitra", "Tetouan", "Safi", "Mohammedia", "El Jadida", 
        "Beni Mellal", "Nador", "Taza", "Settat", "Berrechid", "Khouribga"
    ];

    useEffect(() => {
        import("@/lib/actions/auth").then(m => m.getUser()).then(u => {
            if (u) {
                setUser(u);
                setForm(prev => ({
                    ...prev,
                    fullName: u.profile?.full_name || `${u.profile?.first_name || ""} ${u.profile?.last_name || ""}`.trim(),
                }));
            }
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cart.length === 0) return;

        setLoading(true);
        try {
            const { createOrder } = await import("@/lib/actions/orders");
            const orderItems = cart.map(item => ({
                product_id: item.id,
                quantity: item.quantity,
                price_at_time: item.price
            }));

            const finalCity = isCustomCity ? form.customCity : form.city;

            // Store summary data before clearing
            const summary = {
                fullName: form.fullName,
                total: finalPrice,
                orderId: "",
                trackingCode: ""
            };

            const result = await createOrder(orderItems, {
                fullName: form.fullName,
                phone: form.phone,
                address: form.address,
                city: finalCity,
                notes: form.notes,
                promoCode: appliedPromo?.code || null,
                discountAmount: discountAmount
            });
            
            if (result.error) {
                alert("Erreur lors de la commande: " + result.error);
                setLoading(false);
                return;
            }

            // @ts-ignore
            summary.orderId = result.data?.id || "";
            // @ts-ignore
            summary.trackingCode = result.data?.tracking_code || `VG-${summary.orderId.slice(-5).toUpperCase()}`;
            setSuccessData(summary);
            clearCart();
        } catch (err) {
            console.error("Checkout error:", err);
            alert("Une erreur est survenue lors du paiement.");
        } finally {
            setLoading(false);
        }
    };

    const handleApplyPromo = async () => {
        if (!promoCodeInput.trim()) return;
        setApplyingPromo(true);
        setPromoError("");
        try {
            const codeToApply = promoCodeInput.trim().toUpperCase();
            const q = query(
                collection(db, "promo_codes"), 
                where("code", "==", codeToApply),
                where("active", "==", true)
            );
            const snap = await getDocs(q);
            if (snap.empty) {
                setPromoError("Code invalide ou expiré");
                setAppliedPromo(null);
            } else {
                const data = snap.docs[0].data();
                
                // Check usage limit
                if (data.usageLimit && (data.timesUsed || 0) >= data.usageLimit) {
                    setPromoError("Ce code a atteint sa limite d'utilisation");
                    setAppliedPromo(null);
                    setApplyingPromo(false);
                    return;
                }

                // Check if cart has eligible products if restricted
                if (data.productIds && data.productIds.length > 0) {
                    const hasEligible = cart.some(item => data.productIds.includes(item.id));
                    if (!hasEligible) {
                        setPromoError("Ce code n'est pas applicable aux produits de votre panier");
                        setAppliedPromo(null);
                        setApplyingPromo(false);
                        return;
                    }
                }

                setAppliedPromo({
                    code: data.code,
                    discount: data.discountValue,
                    type: data.discountType,
                    productIds: data.productIds,
                    usageLimit: data.usageLimit,
                    timesUsed: data.timesUsed || 0
                });
                setPromoCodeInput("");
            }
        } catch (e) {
            setPromoError("Erreur lors de la vérification");
        } finally {
            setApplyingPromo(false);
        }
    };

    if (successData) {
        return (
            <main className="min-h-screen pt-48 pb-32 bg-[#F8FAF5] flex items-center justify-center relative">
                <button 
                    onClick={() => setSuccessData(null)}
                    className="absolute top-10 right-10 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-100 hover:scale-110 active:scale-95 transition-all z-50 group"
                >
                    <X size={20} className="text-slate-400 group-hover:text-rose-500 transition-colors" />
                </button>

                <div className="max-w-2xl w-full mx-auto px-10 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="w-24 h-24 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-10 shadow-xl border border-emerald-100 animate-bounce-subtle">
                        <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-[#1A2E28] tracking-tighter mb-6 font-outfit uppercase px-4">
                        Merci <span className="italic font-normal text-[#C9A96E] font-playfair lowercase">{successData.fullName.split(' ')[0]}</span>
                    </h1>
                    
                    <div className="bg-white rounded-3xl p-6 md:p-10 border border-[#E8E3DB] mb-12 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden mx-4">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <ShoppingBag size={80} />
                        </div>
                        
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Résumé de commande</p>
                        <div className="text-3xl md:text-4xl font-black text-[#1A2E28] tracking-tighter mb-8">
                            {successData.total.toFixed(2)} <span className="text-sm font-bold text-slate-300 uppercase">dh</span>
                        </div>

                        <div className="pt-8 border-t border-slate-50">
                            <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mb-3 px-2">Votre code de suivi personnel</p>
                            <div className="inline-flex items-center gap-3 md:gap-4 bg-slate-50 px-4 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl border border-slate-100 group">
                                <span className="text-lg md:text-xl font-black text-[#1A2E28] tracking-widest">{successData.trackingCode}</span>
                                <button 
                                    onClick={() => {
                                        navigator.clipboard.writeText(successData.trackingCode);
                                        alert("Code de suivi copié !");
                                    }}
                                    className="p-2 hover:bg-white rounded-lg transition-all text-slate-300 hover:text-[#C9A96E]"
                                >
                                    <Copy size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link 
                            href={`/tracking?code=${successData.trackingCode}`} 
                            className="w-full sm:w-auto px-10 py-5 bg-[#C9A96E] text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-[#b8985d] transition-all shadow-xl shadow-[#C9A96E]/20 flex items-center justify-center gap-3 group"
                        >
                            Suivre mon colis
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link 
                            href="/" 
                            className="w-full sm:w-auto px-10 py-5 bg-white text-[#1A2E28] text-[11px] font-black uppercase tracking-widest rounded-xl border border-[#E8E3DB] hover:bg-slate-50 transition-all"
                        >
                            Continuer mes achats
                        </Link>
                    </div>
                </div>

                <style jsx>{`
                    @keyframes bounce-subtle {
                        0%, 100% { transform: translateY(0) scale(1); }
                        50% { transform: translateY(-10px) scale(1.05); }
                    }
                    .animate-bounce-subtle {
                        animation: bounce-subtle 3s ease-in-out infinite;
                    }
                `}</style>
            </main>
        );
    }

    if (cart.length === 0) {
        return (
            <main className="min-h-screen pt-48 pb-32 bg-[#F8FAF5] flex items-center justify-center">
                <div className="text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm border border-[#E8E3DB]">
                        <ShoppingBag className="w-8 h-8 text-slate-200" />
                    </div>
                    <h1 className="text-3xl font-bold text-[#1A2E28] mb-4 uppercase tracking-tighter font-outfit">Votre coffret est vide</h1>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-10">Laissez-vous tenter par nos rituels d'exception.</p>
                    <Link href="/products" className="px-12 py-5 bg-[#1A2E28] text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-[#2a453d] transition-all">
                        Découvrir les produits
                    </Link>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen pt-40 pb-32 bg-[#F8FAF5]">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                {/* ── HEADER ── */}
                <div className="mb-16 flex flex-col items-start animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-px bg-[#C9A96E]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C9A96E]">L'Atelier Bazaar</span>
                    </div>
                    <h1 className="text-4xl md:text-7xl font-bold text-[#1A2E28] tracking-tighter leading-none font-outfit uppercase">
                        Finaliser mon <span className="italic font-normal text-[#C9A96E] font-playfair lowercase">panier</span>
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Left Column - Form */}
                    <div className="lg:col-span-12 xl:col-span-8 space-y-8 animate-in fade-in duration-700 delay-100">
                        {/* Shipping Form Card */}
                        <div className="bg-white rounded-3xl border border-[#E8E3DB] p-8 md:p-12 shadow-sm">
                            <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-50">
                                <div>
                                    <h2 className="text-2xl font-bold text-[#1A2E28] tracking-tight font-outfit">Informations Personnelles</h2>
                                    <p className="text-slate-400 text-xs mt-1 font-light">Ces détails seront utilisés pour confirmer et livrer votre commande.</p>
                                </div>
                                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100/50">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest leading-none">Scellage sécurisé</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                                {/* Nom Complet (Full Width) */}
                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Nom Complet</label>
                                    <input
                                        required
                                        value={form.fullName}
                                        onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                                        className="w-full bg-[#fcfdfa] border border-[#E8E3DB] rounded-xl py-5 px-8 text-sm focus:outline-none focus:ring-4 focus:ring-[#C9A96E]/5 focus:border-[#C9A96E] transition-all font-medium text-[#1A2E28] placeholder:text-slate-300"
                                        placeholder="Ex: Mohammed El Alami"
                                    />
                                </div>

                                {/* Ville & Telephone (Place of Email) */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Ville</label>
                                <div className="space-y-4">
                                    <CustomSelect
                                        label="Ville"
                                        options={[...MOROCCAN_CITIES.map(c => ({ id: c, name: c })), { id: 'custom', name: 'Autre ville...' }]}
                                        value={isCustomCity ? "custom" : form.city}
                                        onChange={(val) => {
                                            if (val === "custom") {
                                                setIsCustomCity(true);
                                            } else {
                                                setIsCustomCity(false);
                                                setForm(f => ({ ...f, city: val || "" }));
                                            }
                                        }}
                                        placeholder="Sélectionner votre ville"
                                        className="w-full"
                                    />
                                    
                                    {isCustomCity && (
                                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                            <input
                                                required
                                                value={form.customCity}
                                                onChange={e => setForm(f => ({ ...f, customCity: e.target.value }))}
                                                className="w-full bg-[#fcfdfa] border border-[#E8E3DB] rounded-xl py-5 px-8 text-sm focus:outline-none focus:ring-4 focus:ring-[#C9A96E]/5 focus:border-[#C9A96E] transition-all font-medium text-[#1A2E28] placeholder:text-slate-300"
                                                placeholder="Saisir votre ville"
                                            />
                                        </div>
                                    )}
                                </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Téléphone</label>
                                    <div className="relative">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2 pr-4 border-r border-slate-100">
                                            <span className="text-xs font-bold text-slate-400">+212</span>
                                        </div>
                                        <input
                                            type="tel" required
                                            value={form.phone}
                                            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                            className="w-full bg-[#fcfdfa] border border-[#E8E3DB] rounded-xl py-5 pl-24 pr-8 text-sm focus:outline-none focus:ring-4 focus:ring-[#C9A96E]/5 focus:border-[#C9A96E] transition-all font-medium text-[#1A2E28] placeholder:text-slate-300"
                                            placeholder="6 00 00 00 00"
                                        />
                                    </div>
                                </div>

                                {/* Adresse (Small & Optional) */}
                                <div className="md:col-span-2 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Adresse Complète <span className="text-slate-300 italic">(Optionnel)</span></label>
                                    </div>
                                    <input
                                        value={form.address}
                                        onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                                        className="w-full bg-[#fcfdfa] border border-[#E8E3DB] rounded-xl py-4 px-8 text-sm focus:outline-none focus:ring-4 focus:ring-[#C9A96E]/5 focus:border-[#C9A96E] transition-all font-medium text-[#1A2E28] placeholder:text-slate-300"
                                        placeholder="Ex: N° 12, Rue El Qods..."
                                    />
                                </div>

                                {/* Notes Optionnel (Small) */}
                                <div className="md:col-span-2 space-y-3 pt-4">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Notes pour la livraison <span className="text-slate-300 italic">(Optionnel)</span></label>
                                    </div>
                                    <input
                                        value={form.notes}
                                        onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                                        className="w-full bg-[#fcfdfa] border border-[#E8E3DB] rounded-xl py-4 px-8 text-sm focus:outline-none focus:ring-4 focus:ring-[#C9A96E]/5 focus:border-[#C9A96E] transition-all font-medium text-[#1A2E28] placeholder:text-slate-300"
                                        placeholder="Ex: Près de l'école Mohammed V, etc."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method Notice */}
                        <div className="bg-[#1A2E28] rounded-3xl p-10 border border-white/5 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                                <Wallet size={100} className="text-[#C9A96E]" />
                            </div>
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                <div>
                                    <h3 className="text-xl font-bold text-white font-outfit flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                                            <Wallet size={18} className="text-[#C9A96E]" />
                                        </div>
                                        Paiement à la livraison
                                    </h3>
                                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mt-3 max-w-sm">
                                        Réglez votre rituel de beauté en toute sécurité auprès de notre transporteur partenaire.
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/5">
                                    <div className="flex -space-x-3">
                                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" className="w-9 h-9 rounded-full border-2 border-[#1A2E28] object-cover" alt="User" />
                                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" className="w-9 h-9 rounded-full border-2 border-[#1A2E28] object-cover" alt="User" />
                                        <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" className="w-9 h-9 rounded-full border-2 border-[#1A2E28] object-cover" alt="User" />
                                    </div>
                                    <span className="text-[9px] font-black text-white uppercase tracking-widest">+500 rituels expédiés</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Summary */}
                    <div className="lg:col-span-12 xl:col-span-4 animate-in fade-in duration-700 delay-200">
                        <div className="bg-white rounded-3xl border border-[#E8E3DB] p-8 md:p-10 shadow-lg sticky top-32">
                            <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-50">
                                <h2 className="text-2xl font-bold text-[#1A2E28] tracking-tight font-outfit">Récapitulatif</h2>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{cart.length} articles</span>
                            </div>

                            <div className="space-y-8 mb-10 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex gap-4 items-center group">
                                        <div className="w-16 h-20 rounded-xl bg-[#F8FAF5] flex-shrink-0 relative overflow-hidden group-hover:scale-105 transition-all">
                                            {item.image ? (
                                                <img src={item.image} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-200">
                                                    <Sparkles size={16} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-[11px] font-black text-[#1A2E28] uppercase truncate tracking-wider mb-1 font-outfit">{item.title}</h4>
                                            <div className="text-[10px] font-medium text-slate-400 tracking-wide flex items-center gap-2">
                                                <span>Qty: {item.quantity}</span>
                                                <span className="w-1 h-1 rounded-full bg-slate-200" />
                                                <span>{Number(item.price).toFixed(2)} DH</span>
                                            </div>
                                        </div>
                                        <div className="text-sm font-bold text-[#1A2E28] tracking-tight whitespace-nowrap">
                                            {(Number(item.price) * item.quantity).toFixed(2)} DH
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Promo Code Section */}
                            <div className="mb-8 pt-4 border-t border-slate-50">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">Code Promo</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                                            <Ticket size={16} />
                                        </div>
                                        <input
                                            value={promoCodeInput}
                                            onChange={e => setPromoCodeInput(e.target.value)}
                                            placeholder="Ex: BIENVENUE10"
                                            className="w-full bg-[#fcfdfa] border border-[#E8E3DB] rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-[#C9A96E]/5 focus:border-[#C9A96E] transition-all font-mono uppercase tracking-widest text-[#1A2E28] placeholder:text-slate-300 placeholder:font-sans placeholder:tracking-normal placeholder:normal-case"
                                            disabled={appliedPromo !== null || applyingPromo}
                                        />
                                    </div>
                                    {appliedPromo ? (
                                        <button
                                            type="button"
                                            onClick={() => setAppliedPromo(null)}
                                            className="px-6 py-4 bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-100 transition-all"
                                        >
                                            Retirer
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleApplyPromo}
                                            disabled={!promoCodeInput.trim() || applyingPromo}
                                            className="px-6 py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50"
                                        >
                                            {applyingPromo ? <Loader2 size={14} className="animate-spin" /> : 'Appliquer'}
                                        </button>
                                    )}
                                </div>
                                {promoError && (
                                    <p className="text-xs font-bold text-rose-500 mt-2">{promoError}</p>
                                )}
                                {appliedPromo && (
                                    <div className="flex items-center gap-2 mt-3 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-lg">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                                            Code {appliedPromo.code} appliqué : -{appliedPromo.type === 'percentage' ? `${appliedPromo.discount}%` : `${appliedPromo.discount} DH`}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4 pt-8 border-t border-slate-50 mb-8">
                                <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                    <span>Sous-total</span>
                                    <span className="text-[#1A2E28]">{totalPrice.toFixed(2)} DH</span>
                                </div>
                                {appliedPromo && (
                                    <div className="flex justify-between items-center text-[11px] font-black text-emerald-600 uppercase tracking-widest">
                                        <span>Réduction ({appliedPromo.code})</span>
                                        <span>-{discountAmount.toFixed(2)} DH</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                    <span>Livraison</span>
                                    <span className="text-emerald-600 italic">Offerte</span>
                                </div>
                                <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                                    <span className="text-sm font-bold text-[#1A2E28] uppercase tracking-[0.2em]">Total</span>
                                    <div className="text-right">
                                        {appliedPromo && (
                                            <span className="text-xs font-bold text-slate-300 line-through mr-2">{totalPrice.toFixed(2)} DH</span>
                                        )}
                                        <span className="text-3xl font-bold text-[#1A2E28] tracking-tighter">
                                            {finalPrice.toFixed(2)} <span className="text-xs uppercase font-black text-slate-300 ml-1">dh</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 bg-[#1A1A1A] text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl flex items-center justify-center gap-4 hover:bg-[#C9A96E] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-black/10 group"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Traitement en cours...
                                    </>
                                ) : (
                                    <>
                                        Confirmer la commande
                                        <ArrowRight size={14} className="group-hover:translate-x-1.3 transition-transform" />
                                    </>
                                )}
                            </button>

                            <div className="mt-8 flex items-center justify-center gap-8 opacity-40">
                                <div className="flex flex-col items-center gap-1">
                                    <Sparkles size={14} className="text-[#C9A96E]" />
                                    <span className="text-[7px] font-black uppercase tracking-widest">Authentique</span>
                                </div>
                                <div className="flex flex-col items-center gap-1 border-x border-slate-100 px-6">
                                    <Wallet size={14} />
                                    <span className="text-[7px] font-black uppercase tracking-widest">Sécurisé</span>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <ArrowRight size={14} />
                                    <span className="text-[7px] font-black uppercase tracking-widest">Express</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
}
