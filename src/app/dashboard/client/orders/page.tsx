"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase/config";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { getUser } from "@/lib/actions/auth";
import { Package, Search, ShoppingBag, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ClientOrdersPage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    getUser().then(u => {
      setUser(u);
      if (!u) {
        setLoading(false);
        return;
      }
      const fetchOrders = async (uid: string) => {
        try {
          const q = query(collection(db, "orders"), where("user_id", "==", uid));
          const snapshot = await getDocs(q);
          const fetchedOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          // Sort client-side to avoid composite index requirement
          fetchedOrders.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          setOrders(fetchedOrders);
        } catch (err) {
          console.error("Error fetching client orders:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrders(u.uid);
    });
  }, []);

  const filtered = orders.filter(o => 
    o.id.toLowerCase().includes(search.toLowerCase()) || 
    (o.items || o.order_items || []).some((i: any) => (i.title || "").toLowerCase().includes(search.toLowerCase()))
  );

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed": return { color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", label: "Livrée", dot: "bg-emerald-500" };
      case "cancelled": return { color: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200", label: "Annulée", dot: "bg-rose-500" };
      case "processing": return { color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", label: "En Cours", dot: "bg-blue-500" };
      case "shipped": return { color: "text-[#C9A96E]", bg: "bg-[#C9A96E]/5", border: "border-[#C9A96E]/20", label: "Expédiée", dot: "bg-[#C9A96E]" };
      case "delivering": return { color: "text-[#1A2E28]", bg: "bg-[#1A2E28]/5", border: "border-[#1A2E28]/20", label: "En Livraison", dot: "bg-[#1A2E28]" };
      default: return { color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", label: "En Attente", dot: "bg-amber-500" };
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-slate-200 border-t-[#C9A96E] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#C9A96E]" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C9A96E]">L'Atelier Bazaar</span>
          </div>
          <h1 className="text-5xl font-black text-[#1A2E28] tracking-tighter uppercase leading-none font-outfit">
            Mes <span className="text-[#C9A96E] italic font-normal font-playfair lowercase">Achats</span>
          </h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.4em] mt-4">Historique & Suivi en temps réel</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-[#F2EBE1] shadow-sm overflow-hidden">
        <div className="p-8 border-b border-[#F2EBE1] flex flex-col sm:flex-row justify-between items-center gap-6 bg-slate-50/30">
          <div className="relative w-full sm:w-80 group">
            <Search size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#C9A96E] transition-colors" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher une commande..."
              className="w-full bg-white border border-[#E8E3DB] rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-[#C9A96E]/5 focus:border-[#C9A96E] transition-all text-[#1A2E28] placeholder:text-slate-300"
            />
          </div>
          <div className="flex items-center gap-3 px-5 py-3 bg-white rounded-xl border border-[#E8E3DB] text-[#1A2E28] text-[10px] font-black uppercase tracking-widest shadow-sm">
            <ShoppingBag size={14} className="text-[#C9A96E]" />
            <span>{filtered.length} commandes</span>
          </div>
        </div>

        <div className="hidden md:block overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="py-32 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#F2EBE1]">
                <ShoppingBag size={28} className="text-slate-200" />
              </div>
              <p className="text-slate-300 font-bold text-[10px] uppercase tracking-[0.5em]">Aucun achat trouvé</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#F2EBE1] text-[9px] uppercase font-black text-slate-400 tracking-[0.3em]">
                  <th className="px-10 py-6">Référence</th>
                  <th className="px-8 py-6">Articles</th>
                  <th className="px-8 py-6">Montant</th>
                  <th className="px-8 py-6 text-center">État</th>
                  <th className="px-10 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(order => {
                  const cfg = getStatusConfig(order.status);
                  const items = order.items || order.order_items || [];
                  const itemCount = items.length;
                  return (
                    <tr key={order.id} className="hover:bg-[#FCFBF9] transition-colors group">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white border border-[#E8E3DB] flex items-center justify-center shrink-0 shadow-sm group-hover:border-[#C9A96E]/30 transition-colors">
                            <Package size={16} className="text-slate-300 group-hover:text-[#C9A96E] transition-colors" />
                          </div>
                          <div>
                            <p className="font-mono text-[11px] font-black text-[#1A2E28] uppercase">ORD-{order.id.slice(0, 8)}</p>
                            <p className="text-[9px] text-slate-400 font-bold mt-0.5">
                              {new Date(order.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                           <div className="flex -space-x-2">
                              {items.slice(0, 3).map((it: any, i: number) => (
                                <div key={i} className="w-7 h-9 rounded-md bg-slate-50 border border-white overflow-hidden shadow-sm">
                                   <img src={it.image || it.images?.[0] || "https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=300"} className="w-full h-full object-cover" />
                                </div>
                              ))}
                           </div>
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{itemCount} art.</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-base font-black text-[#1A2E28] tracking-tight">{order.total_amount?.toLocaleString()}</span>
                        <span className="text-[9px] font-black text-[#C9A96E] ml-1.5 uppercase tracking-widest">DH</span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${order.status !== 'completed' && order.status !== 'cancelled' ? 'animate-pulse' : ''}`} />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <Link
                          href={`/dashboard/client/orders/${order.id}`}
                          className="px-6 py-2.5 rounded-xl bg-white text-[#1A2E28] text-[9px] font-black uppercase tracking-[0.2em] border border-[#E8E3DB] hover:border-[#C9A96E] hover:text-[#C9A96E] transition-all inline-flex items-center gap-2 shadow-sm"
                        >
                          Suivre
                          <ArrowRightIcon size={12} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Mobile View: Cards */}
        <div className="md:hidden p-4 flex flex-col gap-4 bg-[#FCFBF9]/50">
          {filtered.length === 0 ? (
            <div className="py-24 text-center">
              <div className="w-14 h-14 bg-white rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 border border-[#F2EBE1] shadow-sm">
                <ShoppingBag size={24} className="text-[#C9A96E]/40" />
              </div>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.4em]">Aucun achat trouvé</p>
            </div>
          ) : (
            filtered.map((order: any) => {
              const cfg = getStatusConfig(order.status);
              const items = order.items || order.order_items || [];
              const itemCount = items.length;
              return (
                <div key={order.id} className="bg-white p-6 rounded-[2rem] border border-[#F2EBE1] shadow-sm flex flex-col gap-5">
                  <div className="flex items-start justify-between border-b border-[#F2EBE1] pb-4">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-[#E8E3DB]">
                           <Package size={16} className="text-[#C9A96E]" />
                        </div>
                        <div>
                           <p className="font-mono text-[11px] font-black text-[#1A2E28] uppercase">ORD-{order.id.slice(0, 8)}</p>
                           <p className="text-[10px] text-slate-400 font-medium mt-0.5">Le {new Date(order.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <span className="text-base font-black text-[#1A2E28]">{order.total_amount?.toLocaleString()} <span className="text-[8px] text-[#C9A96E] uppercase tracking-widest">DH</span></span>
                     </div>
                  </div>

                  <div className="flex items-center justify-between px-1">
                     <div className="flex items-center gap-3">
                        <div className="flex -space-x-1.5">
                           {items.slice(0, 3).map((it: any, i: number) => (
                             <div key={i} className="w-7 h-7 rounded-full bg-slate-50 border border-white overflow-hidden shadow-sm">
                                <img src={it.image || it.images?.[0] || "https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=300"} className="w-full h-full object-cover" />
                             </div>
                           ))}
                        </div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{itemCount} art.</span>
                     </div>
                     <span className={`inline-flex items-center justify-center px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} mr-1.5 ${order.status !== 'completed' && order.status !== 'cancelled' ? 'animate-pulse' : ''}`} />
                        {cfg.label}
                     </span>
                  </div>

                  <Link
                     href={`/dashboard/client/orders/${order.id}`}
                     className="w-full py-4 rounded-xl bg-[#1A2E28] text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#C9A96E] transition-all flex items-center justify-center gap-2 mt-2 shadow-xl shadow-[#1A2E28]/10 group"
                  >
                     Suivre l'achat
                     <ArrowRightIcon size={12} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function ArrowRightIcon(props: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
