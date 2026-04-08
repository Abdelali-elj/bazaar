"use client";
import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search, MapPin, Package, Truck, CheckCircle2, Clock, AlertCircle, ArrowRight } from "lucide-react";
import { getOrderByTrackingCode } from "@/lib/actions/orders";

export default function TrackingPage() {
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState<any>(null);
    const [error, setError] = useState("");
    const resultsRef = React.useRef<HTMLDivElement>(null);

    const handleTrack = async (explicitCode?: string) => {
        const trackingCode = explicitCode || code;
        if (!trackingCode.trim()) return;
        setLoading(true);
        setError("");
        setOrder(null);
        try {
            const res = await getOrderByTrackingCode(trackingCode);
            if (res) {
                setOrder(res);
                // Scroll to results after a short delay to allow rendering
                setTimeout(() => {
                    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            } else {
                setError("Oups ! Code Introuvable.");
            }
        } catch (err) {
            setError("Erreur de connexion.");
        } finally {
            setLoading(false);
        }
    };

    // Auto-track on mount if code is in URL
    React.useEffect(() => {
        const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
        const codeParam = searchParams?.get('code');
        if (codeParam) {
            const cleanCode = codeParam.toUpperCase();
            setCode(cleanCode);
            handleTrack(cleanCode);
        }
    }, []);

    const handleSubmitTrack = (e: React.FormEvent) => {
        e.preventDefault();
        handleTrack();
    };

    const statusSteps = [
        { key: "pending", label: "Validée", icon: Clock },
        { key: "processing", label: "Préparation", icon: Package },
        { key: "shipped", label: "Expédiée", icon: Truck },
        { key: "delivering", label: "En Livraison", icon: Truck },
        { key: "completed", label: "Livrée", icon: CheckCircle2 }
    ];

    // Check if the order status is cancelled
    const isCancelled = order?.status === "cancelled";

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "pending": return { color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", label: "Validée", Icon: CheckCircle2 };
            case "processing": return { color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", label: "Préparation", Icon: Package };
            case "shipped": return { color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200", label: "Expédiée", Icon: Truck };
            case "delivering": return { color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", label: "En Livraison", Icon: Truck };
            case "completed": return { color: "text-emerald-900", bg: "bg-emerald-100", border: "border-emerald-300", label: "Livrée", Icon: CheckCircle2 };
            case "cancelled": return { color: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200", label: "Annulée", Icon: AlertCircle };
            default: return { color: "text-slate-600", bg: "bg-slate-50", border: "border-slate-200", label: status, Icon: Package };
        }
    };

    // Map the status to an index. If completed, it will be 4.
    const getStatusIndex = (status: string) => {
        const idx = statusSteps.findIndex(s => s.key === status);
        return idx !== -1 ? idx : 0;
    };
    const currentIdx = getStatusIndex(order?.status);

    return (
        <main className="min-h-screen bg-[#FDFCFB]">
            <Header />
            <div className="pt-32 pb-24 px-4 overflow-hidden">
                <div className="max-w-4xl mx-auto">
                    
                    {/* Balanced Architectural Hero Card */}
                    <div className="bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] p-8 md:p-20 text-center relative overflow-hidden mb-8 md:mb-12 animate-in fade-in slide-in-from-top-10 duration-1000 mx-1">
                        {/* Background Decoration */}
                        <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#C9A96E]/5 rounded-full blur-[100px] -z-10" />
                        
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 mb-8">
                            <MapPin size={12} className="text-[#C9A96E]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1A2E28]">Suivi de Commande Premium</span>
                        </div>
                        
                        <h1 className="text-3xl md:text-6xl font-black text-[#1A2E28] uppercase tracking-tighter mb-6 italic leading-none">
                            Où est votre <br/>
                            <span className="text-[#C9A96E] not-italic">colis ?</span>
                        </h1>
                        
                        <div className="w-16 h-1 bg-[#C9A96E]/20 mx-auto mb-8 rounded-full" />
                        
                        <p className="text-slate-400 font-bold max-w-lg mx-auto mb-12 text-[10px] md:text-xs uppercase tracking-[0.3em] leading-relaxed">
                            Saisissez votre numéro de suivi précieux (ex: VG-XXXXX) <br/>
                            pour localiser votre commande en temps réel.
                        </p>

                        <form onSubmit={handleSubmitTrack} className="max-w-xl mx-auto flex flex-col md:flex-row gap-4 p-2 bg-slate-50 rounded-[2.2rem] border border-slate-100 focus-within:bg-white focus-within:ring-12 focus-within:ring-[#1A2E28]/5 transition-all shadow-inner relative">
                            <input 
                                value={code}
                                onChange={e => setCode(e.target.value.toUpperCase())}
                                placeholder="EX: VG-IZEIA"
                                className="flex-1 bg-transparent px-6 md:px-8 py-3 md:py-4 text-lg md:text-xl font-black tracking-[0.1em] focus:outline-none placeholder:text-slate-300"
                            />
                            <button 
                                type="submit"
                                disabled={loading || !code}
                                className="bg-[#1A2E28] text-white px-10 py-4 rounded-full text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#C9A96E] transition-all disabled:opacity-50 shadow-lg"
                            >
                                {loading ? "..." : <>Suivre <ArrowRight size={16} className="ml-2 inline" /></>}
                            </button>
                        </form>
                        {error && <p className="mt-8 text-rose-500 font-black text-[10px] uppercase tracking-[0.4em] animate-pulse">{error}</p>}
                    </div>

                    {/* Results Combined Card */}
                    {order && (
                        <div ref={resultsRef} className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.1)] overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 mx-1 mb-12 scroll-mt-32">
                            {/* Stepper Inside Section */}
                            <div className="p-8 md:p-14 border-b border-slate-50 bg-slate-50/20">
                                {isCancelled ? (
                                    <div className="flex flex-col items-center justify-center py-6">
                                        <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 mb-4 animate-[pulse_2s_ease-in-out_infinite] shadow-lg shadow-rose-500/20">
                                            <AlertCircle size={32} />
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-black text-rose-600 uppercase tracking-widest text-center">Commande Annulée</h3>
                                        <p className="text-[10px] text-rose-400 font-bold uppercase tracking-[0.2em] mt-3 text-center">Le traitement de cette commande a été interrompu.</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col md:flex-row justify-between items-center gap-12 relative">
                                        {/* Background line for desktop */}
                                        <div className="hidden md:block absolute top-[22px] left-0 right-0 h-[2px] bg-slate-100 z-0" />
                                        
                                        {statusSteps.map((step, idx) => {
                                            const Icon = step.icon;
                                            const isPast = idx < currentIdx;
                                            const isCurrent = idx === currentIdx;
                                            const isDone = idx <= currentIdx;
                                            return (
                                                <div key={idx} className="flex flex-col items-center gap-4 group flex-1 relative z-10 w-full md:w-auto">
                                                    {/* Mobile vertical line */}
                                                    {idx < statusSteps.length - 1 && (
                                                        <div className="md:hidden absolute top-11 left-1/2 -translate-x-1/2 w-[2px] h-[40px] bg-slate-100 -z-10" />
                                                    )}
                                                    <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-500 relative ${isCurrent ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/30 scale-110' : isPast ? 'bg-emerald-100 text-emerald-500' : 'bg-white text-slate-200 border border-slate-100'}`}>
                                                        <Icon size={18} strokeWidth={isCurrent ? 2.5 : 2} />
                                                    </div>
                                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] text-center ${isCurrent ? 'text-emerald-600' : isPast ? 'text-emerald-500/60' : 'text-slate-300'}`}>{step.label}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Order Details Grid */}
                            <div className="p-8 md:p-14 md:flex divide-y md:divide-y-0 md:divide-x divide-slate-100">
                                <div className="flex-1 pb-8 md:pb-0 md:pr-10">
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#C9A96E] mb-8">Articles Commandés</h3>
                                    <div className="space-y-6">
                                        {order.order_items?.map((item: any, idx: number) => (
                                            <div key={idx} className="flex gap-5 group items-center">
                                                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0 group-hover:scale-110 shadow-lg transition-all duration-500">
                                                    <img src={item.image || item.products?.images?.[0] || item.products?.image_url || "https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=300"} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <h4 className="text-[12px] font-black uppercase tracking-tight text-[#1A2E28] leading-none italic">{item.products?.title}</h4>
                                                    <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Quantité: {item.quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex-1 pt-8 md:pt-0 md:px-10">
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#C9A96E] mb-8">Résumé Financier</h3>
                                    <div className="space-y-4">
                                        <div className="bg-[#1A2E28] p-6 rounded-[2rem] shadow-xl shadow-black/5 relative overflow-hidden group border border-white/5">
                                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mb-2 block">Montant Total</span>
                                            <span className="text-3xl font-black text-white italic">{order.total_amount?.toLocaleString()} <span className="text-[10px] not-italic text-[#C9A96E]">DH</span></span>
                                        </div>
                                        <div className="p-6 rounded-[2rem] border-2 border-slate-50 flex flex-col gap-1 bg-white/50">
                                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 block">Date de Validation</span>
                                            <span className="text-sm font-black text-[#1A2E28] uppercase italic">{new Date(order.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 pt-8 md:pt-0 md:pl-10">
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#C9A96E] mb-8">Client</h3>
                                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100/50">
                                        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-200/50">
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#1A2E28] border border-slate-100">
                                                <span className="text-[10px] font-black">{order.fullName?.charAt(0)}</span>
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-black uppercase tracking-tighter text-[#1A2E28]">{order.fullName}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{order.phone}</p>
                                            </div>
                                        </div>
                                        {(() => {
                                            const cfg = getStatusConfig(order.status);
                                            const Icon = cfg.Icon;
                                            return (
                                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[9px] font-black uppercase tracking-widest ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                                                    <Icon size={12} strokeWidth={2.5} /> {cfg.label}
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </main>
    );
}
