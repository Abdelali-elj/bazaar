"use client";
import React, { useState, useEffect } from "react";
import { X, Loader2, CheckCircle2, User, Phone, MapPin, ShieldCheck, Zap, Ticket, Tag, ArrowRight, ArrowLeft, Plus, Minus, Copy, ChevronDown } from "lucide-react";
import CustomSelect from "../ui/CustomSelect";
import { createOrder } from "@/lib/actions/orders";
import { useActiveOffer } from "@/components/ActiveOfferContext";
import { db } from "@/lib/firebase/config";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { useRouter } from "next/navigation";

const MOROCCAN_CITIES = [
    "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir", "Meknès", 
    "Oujda", "Kenitra", "Tetouan", "Safi", "Mohammedia", "El Jadida", 
    "Beni Mellal", "Nador", "Taza", "Settat", "Berrechid", "Khouribga"
];

interface FastBuyFormProps {
    product: any;
    quantity?: number;
    onClose?: () => void;
    isFullScreen?: boolean;
    showProductSummary?: boolean;
}

export default function FastBuyForm({ 
    product, 
    quantity: initialQuantity = 1, 
    onClose, 
    isFullScreen = false,
    showProductSummary = true
}: FastBuyFormProps) {
    const { calculateDiscountedPrice } = useActiveOffer();
    const [loading, setLoading] = useState(false);
    const [successData, setSuccessData] = useState<{ fullName: string, orderId: string, trackingCode: string, total: number } | null>(null);
    const [isCustomCity, setIsCustomCity] = useState(false);

    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        city: "",
        customCity: "",
    });
    const [quantity, setQuantity] = useState(initialQuantity);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [promoCode, setPromoCode] = useState("");
    const [isApplyingPromo, setIsApplyingPromo] = useState(false);
    const [appliedPromo, setAppliedPromo] = useState<any>(null);
    const [promoError, setPromoError] = useState("");

    const router = useRouter();

    const originalPrice = Number(product.price) || 0;
    const unitPrice = calculateDiscountedPrice(originalPrice, product.id);
    const subtotal = unitPrice * quantity;
    
    // Calculate Promo Discount
    let discountAmount = 0;
    if (appliedPromo) {
        if (appliedPromo.discountType === 'percentage') {
            discountAmount = subtotal * (appliedPromo.discountValue / 100);
        } else {
            discountAmount = appliedPromo.discountValue;
        }
    }
    
    const finalPrice = Math.max(0, subtotal - discountAmount);
    const hasDiscount = unitPrice < originalPrice;

    useEffect(() => {
        if (!isFullScreen) {
            document.body.style.overflow = 'hidden';
            return () => { document.body.style.overflow = 'unset'; };
        }
    }, [isFullScreen]);

    const handleApplyPromo = async () => {
        if (!promoCode.trim()) return;
        setIsApplyingPromo(true);
        setPromoError("");
        try {
            const q = query(
                collection(db, "promo_codes"), 
                where("code", "==", promoCode.trim().toUpperCase()),
                where("active", "==", true),
                limit(1)
            );
            const snap = await getDocs(q);
            
            if (snap.empty) {
                setPromoError("Code invalide ou expiré.");
                setAppliedPromo(null);
            } else {
                const pc = snap.docs[0].data();
                if (pc.usageLimit && (pc.timesUsed || 0) >= pc.usageLimit) {
                    setPromoError("Limite d'utilisation atteinte.");
                } else {
                    setAppliedPromo(pc);
                    setPromoCode(pc.code);
                }
            }
        } catch (err) {
            setPromoError("Erreur de vérification.");
        } finally {
            setIsApplyingPromo(false);
        }
    };

    const handleBack = () => {
        if (onClose) onClose();
        else router.back();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const finalCity = isCustomCity ? form.customCity : form.city;

        try {
            const result = await createOrder([{
                product_id: product.id,
                quantity: quantity,
                price_at_time: unitPrice
            }], {
                fullName: form.fullName,
                phone: form.phone,
                city: finalCity,
                address: "Fast Buy (No Address Specified)",
                notes: appliedPromo ? `Promo code used: ${appliedPromo.code} (-${discountAmount} DH)` : "Fast Buy Order"
            });

            if (result.error) {
                alert("Erreur lors de la commande : " + result.error);
                setLoading(false);
                return;
            }

            const orderId = result.data?.id || "";
            const trackingCode = `VG-${orderId.slice(-5).toUpperCase() || Math.random().toString(36).slice(-5).toUpperCase()}`;

            setSuccessData({
                fullName: form.fullName,
                orderId: orderId,
                trackingCode: trackingCode,
                total: finalPrice
            });
        } catch (err) {
            console.error(err);
            alert("Une erreur est survenue.");
            setLoading(false);
        }
    };

    if (successData) {
        return (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                <div className="relative w-full max-w-md bg-white rounded-[2rem] p-10 text-center animate-in zoom-in-95 duration-500 shadow-2xl">
                    <button onClick={() => isFullScreen ? router.push('/') : handleBack()} className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 transition-all hover:rotate-90">
                        <X size={20} />
                    </button>
                    <div className="relative w-24 h-24 mx-auto mb-6">
                        <div className="w-full h-full rounded-full overflow-hidden border-4 border-emerald-100 shadow-xl">
                            <img 
                                src={product.images?.[0] || product.image_url || "https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=300"} 
                                alt={product.title} 
                                className="w-full h-full object-cover" 
                            />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white shadow-lg">
                            <CheckCircle2 size={16} strokeWidth={3} />
                        </div>
                    </div>
                    <h2 className="text-3xl font-black text-[#1A2E28] uppercase tracking-tighter mb-4">Commande Confirmée</h2>
                    <p className="text-slate-500 text-sm font-medium mb-6">
                        Merci {successData.fullName}, votre commande FastShop a été enregistrée avec succès.
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-center">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Total</p>
                            <p className="text-xl font-black text-[#1A2E28]">{successData.total.toLocaleString()} <span className="text-[10px]">DH</span></p>
                        </div>
                        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 text-center relative group">
                            <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600 mb-1">Code de Suivi</p>
                            <div className="flex items-center justify-center gap-2">
                                <p className="text-xl font-black text-emerald-700 tracking-tighter">{successData.trackingCode}</p>
                                <button 
                                    onClick={() => navigator.clipboard.writeText(successData.trackingCode)}
                                    className="p-1.5 rounded-md hover:bg-emerald-100 text-emerald-600 transition-colors"
                                    title="Copier le code"
                                >
                                    <Copy size={12} />
                                </button>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => isFullScreen ? router.push('/') : handleBack()} className="w-full py-4 bg-[#1A2E28] text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-[#C9A96E] transition-colors">
                        Continuer mes achats
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={isFullScreen ? "w-full max-w-xl mx-auto" : "fixed inset-0 z-[120] flex flex-col justify-end sm:items-center sm:justify-center p-0 sm:p-4"}>
            {!isFullScreen && <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />}
            
            <div className={`relative w-full bg-white ${isFullScreen ? "rounded-[2.5rem]" : "sm:rounded-[2.5rem] rounded-t-[2.5rem] flex flex-col max-h-[90vh] shadow-2xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-10 sm:zoom-in-95 duration-500 overflow-hidden"}`}>
                
                {/* Header */}
                {!isFullScreen && (
                    <div className={`px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10`}>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-[#C9A96E]">
                                <Zap size={18} className="fill-current" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">FastShop</h2>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Achat direct express</p>
                            </div>
                        </div>
                        <button onClick={handleBack} className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-400 transition-all">
                            <X size={18} />
                        </button>
                    </div>
                )}

                <div className={`${isFullScreen ? "" : "p-8 overflow-y-auto custom-scrollbar bg-white rounded-3xl border border-[#F2EBE1] shadow-2xl"}`}>
                    <form onSubmit={handleSubmit} className="space-y-6" suppressHydrationWarning={true}>
                        
                        {/* Product Summary - Enhanced with Gallery */}
                        {showProductSummary && (
                            <div className="bg-white rounded-2xl p-4 border border-[#1A2E28]/10 shadow-sm flex flex-col gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 shrink-0 border border-slate-100 shadow-inner">
                                        <img 
                                            src={product.images?.[activeImageIndex] || product.image_url || "https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=300"} 
                                            alt={product.title} 
                                            className="w-full h-full object-cover animate-in fade-in duration-300" 
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-black text-slate-900 truncate uppercase tracking-tight mb-1">{product.title}</h3>
                                        <div className="flex items-center justify-between">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Quantité: {quantity}</p>
                                            <span className="text-lg font-black text-[#1A2E28]">{finalPrice.toLocaleString()} DH</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Thumbnail Switcher (if multiple images) */}
                                {product.images && product.images.length > 1 && (
                                    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-t border-slate-50 pt-3">
                                        {product.images.map((img: string, idx: number) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => setActiveImageIndex(idx)}
                                                className={`w-10 h-10 rounded-md overflow-hidden border-2 transition-all shrink-0 ${
                                                    activeImageIndex === idx 
                                                    ? 'border-[#1A2E28] ring-2 ring-[#1A2E28]/10' 
                                                    : 'border-transparent opacity-50 hover:opacity-100'
                                                }`}
                                            >
                                                <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Unified Shipping Section */}
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nom Complet</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                            <User size={14} className="text-slate-300 group-focus-within:text-[#1A2E28] transition-colors" />
                                        </div>
                                        <input 
                                            required 
                                            value={form.fullName}
                                            onChange={e => setForm({...form, fullName: e.target.value})}
                                            suppressHydrationWarning={true}
                                            className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-[14px] font-medium focus:outline-none focus:border-[#1A2E28] focus:ring-4 focus:ring-[#1A2E28]/5 shadow-sm transition-all placeholder:text-slate-300"
                                            placeholder="Ex: Mohammed El Alami"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Téléphone</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                            <Phone size={14} className="text-slate-300 group-focus-within:text-[#1A2E28] transition-colors" />
                                        </div>
                                        <input 
                                            required 
                                            type="tel"
                                            value={form.phone}
                                            onChange={e => setForm({...form, phone: e.target.value})}
                                            suppressHydrationWarning={true}
                                            className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-[14px] font-medium focus:outline-none focus:border-[#1A2E28] focus:ring-4 focus:ring-[#1A2E28]/5 shadow-sm transition-all placeholder:text-slate-300"
                                            placeholder="06 -- -- -- --"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <CustomSelect
                                    label="Ville de destination"
                                    options={[...MOROCCAN_CITIES.map(c => ({ id: c, name: c })), { id: 'other', name: 'Autre ville...' }]}
                                    value={form.city}
                                    onChange={(val) => {
                                        if (val === 'other') {
                                            setIsCustomCity(true);
                                            setForm({ ...form, city: 'other' });
                                        } else {
                                            setIsCustomCity(false);
                                            setForm({ ...form, city: val || "" });
                                        }
                                    }}
                                    placeholder="Choisir votre ville"
                                    className="w-full"
                                />

                                {isCustomCity && (
                                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                        <input
                                            required
                                            type="text"
                                            value={form.customCity}
                                            onChange={(e) => setForm({ ...form, customCity: e.target.value })}
                                            suppressHydrationWarning={true}
                                            className="w-full bg-white border border-slate-200 rounded-xl px-6 py-4 text-[14px] font-medium focus:outline-none focus:border-[#1A2E28] focus:ring-4 focus:ring-[#1A2E28]/5 shadow-sm transition-all placeholder:text-slate-300"
                                            placeholder="Saisissez votre ville"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quantity & Promo Section */}
                        <div className="space-y-6">
                            {/* White Side-Aligned Quantity Control */}
                            <div className="flex flex-col items-start gap-1.5 pb-2">
                                <span className="text-[10px] font-bold text-slate-400 lowercase tracking-widest ml-1">quantite:</span>
                                <div className="flex items-center bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-11 px-1">
                                    <button 
                                        type="button"
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-11 h-full flex items-center justify-center hover:bg-slate-50 transition-all text-[#C9A96E] group"
                                    >
                                        <Plus size={16} className="stroke-[3] group-active:scale-90 transition-transform" />
                                    </button>
                                    <div className="w-8 h-full flex items-center justify-center text-[#1A2E28] text-[16px] font-black tabular-nums">
                                        {quantity}
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-11 h-full flex items-center justify-center hover:bg-slate-50 transition-all text-slate-300 group text-center"
                                    >
                                        <Minus size={16} className="stroke-[3] group-active:scale-90 transition-transform" />
                                    </button>
                                </div>
                            </div>

                            {/* Promo Section - Enhanced Luxe */}
                            <div className="space-y-2.5">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Code Privilège</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1 group">
                                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                            <Ticket size={14} className="text-slate-300 group-focus-within:text-[#1A2E28] transition-colors" />
                                        </div>
                                        <input 
                                            value={promoCode}
                                            onChange={e => {
                                                setPromoCode(e.target.value.toUpperCase());
                                                setPromoError("");
                                            }}
                                            disabled={!!appliedPromo}
                                            suppressHydrationWarning={true}
                                            className={`w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-[14px] focus:outline-none focus:border-[#1A2E28] focus:ring-4 focus:ring-[#1A2E28]/5 shadow-sm transition-all font-mono tracking-widest uppercase placeholder:font-sans placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-300`}
                                            placeholder="Ex: BAZAAR2024"
                                        />
                                    </div>
                                    {appliedPromo ? (
                                        <button 
                                            type="button"
                                            onClick={() => { setAppliedPromo(null); setPromoCode(""); }}
                                            className="px-6 rounded-xl border border-rose-100 bg-rose-50 text-rose-500 text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-colors"
                                        >
                                            Retirer
                                        </button>
                                    ) : (
                                        <button 
                                            type="button"
                                            onClick={handleApplyPromo}
                                            disabled={!promoCode || isApplyingPromo}
                                            className="px-6 rounded-xl bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-colors disabled:opacity-50 shadow-lg shadow-emerald-600/10"
                                        >
                                            {isApplyingPromo ? "..." : "Vérifier"}
                                        </button>
                                    )}
                                </div>
                                {promoError && (
                                    <p className="flex items-center gap-2 text-[10px] text-rose-500 font-bold ml-1 animate-in fade-in slide-in-from-left-1">
                                        <div className="w-1 h-1 rounded-full bg-rose-500" />
                                        {promoError}
                                    </p>
                                )}
                                {appliedPromo && (
                                    <p className="flex items-center gap-2 text-[10px] text-emerald-600 font-black ml-1 animate-in fade-in slide-in-from-left-1 uppercase tracking-wider">
                                        <CheckCircle2 size={10} />
                                        Réduction validée avec succès !
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Actions nadyin */}
                        <div className="space-y-6 pt-2">
                             {/* Luxe Price Breakdown */}
                             {appliedPromo && (
                                <div className="flex items-center justify-between py-4 px-6 bg-[#FBF9F7] rounded-2xl border border-[#F2EBE1]">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Sous-total</span>
                                        <span className="text-[12px] font-medium text-slate-500 line-through">{subtotal.toLocaleString()} DH</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Remise Appliquée</span>
                                        <span className="text-[16px] font-black text-emerald-600">-{discountAmount.toLocaleString()} DH</span>
                                    </div>
                                </div>
                             )}

                            <div className="flex justify-center pt-2">
                                <button
                                    type="submit"
                                    disabled={loading || !form.fullName || !form.phone || !(isCustomCity ? form.customCity : form.city)}
                                    className="relative group overflow-hidden px-10 py-4 rounded-full bg-[#1A2E28] hover:bg-[#C9A96E] transition-all duration-500 shadow-2xl shadow-[#1A2E28]/20"
                                >
                                    <div className="relative flex items-center gap-6 text-white text-left">
                                        {loading ? (
                                            <Loader2 className="w-5 h-5 animate-spin text-[#C9A96E]" />
                                        ) : (
                                            <>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] leading-none mb-1">Confirmer Achat</span>
                                                    <span className="text-[7px] font-medium text-white/50 uppercase tracking-widest whitespace-nowrap">Livraison Gratuite</span>
                                                </div>
                                                <div className="w-px h-8 bg-white/20" />
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[18px] font-black tracking-tighter leading-none">{finalPrice.toLocaleString()} <span className="text-[8px] font-bold">DH</span></span>
                                                    <span className="text-[6px] font-black text-[#C9A96E] uppercase tracking-widest mt-1">Total TTC</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </button>
                            </div>
                            
                            <div className="flex items-center justify-center gap-4 py-2 opacity-30">
                                <div className="h-px w-8 bg-[#1A2E28]" />
                                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[#1A2E28]">Collection Limitée Bazaar</span>
                                <div className="h-px w-8 bg-[#1A2E28]" />
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
