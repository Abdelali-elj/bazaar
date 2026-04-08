"use client";
import { useState, useEffect, use } from "react";
import { db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { 
  Package, 
  ChevronLeft, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Box, 
  Check,
  Calendar,
  CreditCard
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OrderTrackingPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const orderId = params.id;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!orderId) return;
    
    const fetchOrder = async () => {
      try {
        const docSnap = await getDoc(doc(db, "orders", orderId));
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Populate products if needed (or assume they are in the order document as per createOrder)
          setOrder({ id: docSnap.id, ...data });
        }
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const steps = [
    { id: "pending", label: "Validée", icon: CheckCircle2, desc: "Commande reçue" },
    { id: "processing", label: "Préparation", icon: Box, desc: "En cours de scellage" },
    { id: "shipped", label: "Expédiée", icon: Truck, desc: "Quitté l'entrepôt" },
    { id: "delivering", label: "Livraison", icon: MapPin, desc: "En cours de route" },
    { id: "completed", label: "Livrée", icon: Check, desc: "Remise en main propre" },
  ];

  const getActiveStep = (status: string) => {
    switch (status) {
      case "pending": return 0;
      case "processing": return 1;
      case "shipped": return 2;
      case "delivering": return 3;
      case "completed": return 4;
      default: return 0;
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-slate-100 border-t-[#C9A96E] rounded-full animate-spin" />
    </div>
  );

  if (!order) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <h2 className="text-xl font-bold text-slate-800">Commande non trouvée</h2>
      <Link href="/dashboard/client/orders" className="text-primary hover:underline">Retour à la liste</Link>
    </div>
  );

  const currentStep = getActiveStep(order.status);
  const isCancelled = order.status === "cancelled";

  return (
    <div className="max-w-5xl mx-auto pb-20 space-y-12 animate-in fade-in duration-1000">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-4">
          <Link 
            href="/dashboard/client/orders" 
            className="group flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-[#1A2E28] transition-all"
          >
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Retour aux achats
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-[#1A2E28] tracking-tighter uppercase leading-none">
            Suivi de <span className="text-[#C9A96E] italic lowercase">Commande</span>
          </h1>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-black text-slate-300 uppercase">Ref: ORD-{order.id.slice(0, 8)}</span>
            <div className="w-1 h-1 rounded-full bg-slate-200" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Calendar size={12} />
              {new Date(order.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}
            </span>
          </div>
        </div>

        {isCancelled ? (
          <div className="px-6 py-3 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl text-[10px] font-black uppercase tracking-widest">
            Commande Annulée
          </div>
        ) : (
          <div className="px-6 py-3 bg-[#1A2E28] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#1A2E28]/10 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {steps[currentStep].label}
          </div>
        )}
      </div>

      {/* Progress Bar Segment */}
      {!isCancelled && (
        <div className="bg-white rounded-[3rem] border border-slate-100 p-10 md:p-14 shadow-sm relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-5 gap-8">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isPast = idx < currentStep;
              const isCurrent = idx === currentStep;
              const isFuture = idx > currentStep;

              return (
                <div key={step.id} className="relative flex flex-col items-center text-center group">
                  {/* Connector Line */}
                  {idx < steps.length - 1 && (
                    <div className="hidden sm:block absolute top-7 left-1/2 w-full h-[2px] bg-slate-50 -z-10">
                      <div 
                        className={`h-full bg-[#C9A96E] transition-all duration-1000 delay-300`} 
                        style={{ width: isPast ? '100%' : '0%' }}
                      />
                    </div>
                  )}

                  <div className={`
                    w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500
                    ${isPast ? 'bg-[#1A2E28] text-white shadow-lg' : ''}
                    ${isCurrent ? 'bg-[#C9A96E] text-white shadow-xl scale-110' : ''}
                    ${isFuture ? 'bg-slate-50 text-slate-300 border border-slate-100' : ''}
                  `}>
                    <Icon size={24} className={isCurrent ? "animate-pulse" : ""} />
                  </div>

                  <div className="mt-6 space-y-1">
                    <p className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isFuture ? 'text-slate-300' : 'text-[#1A2E28]'}`}>
                      {step.label}
                    </p>
                    <p className="text-[9px] text-slate-400 font-medium">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Background Decorative Pattern */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none select-none overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full flex flex-wrap gap-4 p-4 text-[40px] font-black uppercase tracking-tighter">
              {Array.from({length: 20}).map((_, i) => <span key={i}>BAZAAR</span>)}
            </div>
          </div>
        </div>
      )}

      {/* Order Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Items List */}
        <div className="lg:col-span-12 xl:col-span-8 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
            <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-sm font-black text-[#1A2E28] uppercase tracking-widest">Articles Commandés</h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{(order.items || []).length} items</span>
            </div>
            <div className="p-2">
              <div className="divide-y divide-slate-50">
                {(order.items || []).map((item: any, i: number) => (
                  <div key={i} className="px-8 py-6 flex items-center gap-6 group hover:bg-slate-50/50 transition-all rounded-2xl">
                    <div className="w-20 h-24 rounded-2xl bg-slate-50 overflow-hidden flex-shrink-0 relative">
                       {/* item.products?.image_url fallback */}
                       <img 
                        src={item.image || item.images?.[0] || "https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=300"} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-sm font-black text-[#1A2E28] leading-none mb-2">{item.title}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quantité: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-[#1A2E28] tracking-tight">{(item.price_at_time * item.quantity).toFixed(2)}</p>
                      <p className="text-[9px] font-bold text-[#C9A96E] uppercase tracking-widest">DH</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-10 py-8 bg-slate-50/50 flex justify-between items-center border-t border-slate-100">
               <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <CreditCard size={14} />
                  Total Réglé
               </div>
               <div className="text-2xl font-black text-[#1A2E28] tracking-tighter">
                  {order.total_amount?.toFixed(2)} <span className="text-xs text-[#C9A96E] ml-1 uppercase">dh</span>
               </div>
            </div>
          </div>
        </div>

        {/* Right: Info Panels */}
        <div className="lg:col-span-12 xl:col-span-4 space-y-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-6 mb-6">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#C9A96E]">
                <MapPin size={18} />
              </div>
              <h3 className="text-[11px] font-black text-[#1A2E28] uppercase tracking-widest">Livraison</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Destinataire</p>
                <p className="text-sm font-bold text-[#1A2E28]">{order.fullName || "Utilisateur"}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Ville</p>
                <p className="text-sm font-bold text-[#1A2E28]">{order.city}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Adresse</p>
                <p className="text-[13px] font-medium text-slate-500 leading-relaxed italic">
                  {order.address || "Adresse non fournie"}
                </p>
              </div>
            </div>
          </div>

          {/* Need Help? */}
          <div className="bg-[#FCFBF9] rounded-[2.5rem] border border-[#F2EBE1] p-8 shadow-sm relative overflow-hidden">
             <div className="relative z-10">
                <h3 className="text-sm font-black text-[#1A2E28] uppercase tracking-widest mb-4">Besoin d'aide ?</h3>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed mb-6">
                  Notre support est disponible 24/7 pour toute question sur votre commande.
                </p>
                <Link 
                  href="/dashboard/client/support" 
                  className="inline-flex items-center gap-3 text-[10px] font-black text-[#C9A96E] uppercase tracking-widest group"
                >
                  Contacter le support
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
             </div>
             <div className="absolute -bottom-4 -right-4 opacity-[0.05] grayscale rotate-12">
                <Box size={120} />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArrowRight(props: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
