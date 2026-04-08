import { adminDb } from "@/lib/firebase/admin";
import Link from "next/link";
import { ShoppingBag, Clock, CheckCircle2, XCircle, Package } from "lucide-react";

export default async function HistoriquePage() {
  let allOrders: any[] = [];
  try {
    const snapshot = await adminDb.collection("orders")
      .where("status", "in", ["completed", "cancelled"])
      .get();
    
    const docs: any[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort manually to avoid requiring a composite index
    docs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    allOrders = docs.slice(0, 50);
  } catch (error) {
    console.error("[HistoriquePage] Error:", error);
  }

  const completed = allOrders.filter((o: any) => o.status === "completed");
  const cancelled = allOrders.filter((o: any) => o.status === "cancelled");
  const totalRevenue = completed.reduce((sum: number, o: any) => sum + (o.total_amount ?? 0), 0);

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-4xl text-slate-900 mb-2 font-black tracking-tight">
            Registre <span className="text-primary italic">Historique</span>
          </h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.4em]">Archives des Flux & Signatures Atelier</p>
        </div>
        <Link
          href="/dashboard/orders"
          className="px-8 py-3 bg-white border border-rose-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary hover:text-white hover:bg-primary transition-all shadow-sm"
        >
          ← Flux Actifs
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 size={18} />
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Terminées</p>
          </div>
          <p className="text-3xl font-black text-slate-900">{completed.length}</p>
        </div>
        <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500">
              <XCircle size={18} />
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Annulées</p>
          </div>
          <p className="text-3xl font-black text-slate-900">{cancelled.length}</p>
        </div>
        <div className="bg-white p-7 rounded-[2rem] border border-rose-100 bg-pink-50/30 shadow-sm group hover:border-primary/20 transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white border border-rose-200 flex items-center justify-center text-primary shadow-sm">
              <Package size={18} />
            </div>
            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Volume d'Affaire</p>
          </div>
          <p className="text-3xl font-black text-primary">{totalRevenue.toLocaleString()} <span className="text-sm font-bold opacity-50">DH</span></p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-10 py-7 border-b border-rose-100 flex items-center gap-4 bg-pink-50/30">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <h2 className="text-lg font-black text-slate-900 italic font-playfair">Archives <span className="text-primary italic">Atelier</span></h2>
        </div>

        <div className="hidden md:block overflow-x-auto custom-scrollbar">
          {allOrders.length === 0 ? (
            <div className="py-32 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100">
                 <Clock size={24} className="text-slate-300" />
              </div>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.5em]">Aucun historique pour le moment.</p>
            </div>
          ) : (
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="bg-white text-[10px] uppercase font-bold text-slate-400 tracking-[0.3em] border-b border-slate-100">
                  <th className="px-10 py-6">Référence</th>
                  <th className="px-8 py-6">Client</th>
                  <th className="px-8 py-6 text-center">Statut</th>
                  <th className="px-8 py-6">Montant</th>
                  <th className="px-8 py-6 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allOrders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-all duration-200 group/row">
                    <td className="px-10 py-6">
                      <span className="font-mono text-[11px] font-black text-primary/40 group-hover/row:text-primary transition-colors uppercase">CFG-{order.id.slice(0, 8)}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-bold text-slate-900">{order.profiles?.first_name ?? "Client"} {order.profiles?.last_name ?? ""}</span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      {order.status === "completed" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 text-[9px] font-black uppercase tracking-wider">
                          <CheckCircle2 size={11} /> Terminé
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 text-[9px] font-black uppercase tracking-wider">
                          <XCircle size={11} /> Annulé
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-lg font-black text-slate-900">{order.total_amount?.toLocaleString()} <span className="text-[9px] font-black text-primary italic uppercase tracking-widest opacity-40">DH</span></span>
                    </td>
                    <td className="px-8 py-6 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover/row:text-slate-900 transition-colors">
                      {new Date(order.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Mobile View: Cards */}
        <div className="md:hidden p-4 flex flex-col gap-4 bg-slate-50/30">
          {allOrders.length === 0 ? (
             <div className="py-16 text-center">
               <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm">
                  <Clock size={20} className="text-slate-300" />
               </div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aucun historique pour le moment.</p>
             </div>
          ) : (
            allOrders.map((order: any) => (
              <div key={order.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col gap-4">
                 <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[11px] font-black text-slate-700 uppercase">CFG-{order.id.slice(0, 8)}</span>
                      <p className="text-sm font-black text-slate-900 mt-1">{order.profiles?.first_name ?? "Client"} {order.profiles?.last_name ?? ""}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-slate-900">{order.total_amount?.toLocaleString()} <span className="text-[9px] font-black text-primary italic uppercase tracking-widest opacity-40">DH</span></span>
                      <p className="text-[10px] font-bold text-slate-400 mt-1">{new Date(order.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}</p>
                    </div>
                 </div>
                 <div className="flex items-center justify-between mt-2 pt-4 border-t border-slate-50">
                    {order.status === "completed" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-[9px] font-black uppercase tracking-wider">
                        <CheckCircle2 size={11} /> Terminé
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-[9px] font-black uppercase tracking-wider">
                        <XCircle size={11} /> Annulé
                      </span>
                    )}
                 </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
