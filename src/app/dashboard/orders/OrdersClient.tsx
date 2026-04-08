"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingBag, User, Package, CheckCircle2,
  Truck, Eye, X, Loader2, MapPin, Phone, Mail, Calendar, Hash, ChevronDown
} from "lucide-react";
import CustomSelect from "@/components/ui/CustomSelect";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function OrdersClient({ orders: initial }: { orders: any[] }) {
  const [orders, setOrders] = useState(initial);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const router = useRouter();

  // Sync local state when server gives new props on router.refresh()
  useEffect(() => {
    setOrders(initial);
  }, [initial]);

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  const handleStatusChange = async (id: string, status: string) => {
    setLoading(id);
    try {
      await fetch("/api/orders/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      if (selectedOrder?.id === id) setSelectedOrder((o: any) => o ? { ...o, status } : o);
    } catch (e) { console.error(e); }
    finally { setLoading(null); }
  };

  const tabs = [
    { id: "all", label: "Toutes", count: orders.length },
    { id: "pending", label: "Validée", count: orders.filter(o => o.status === "pending").length },
    { id: "processing", label: "Préparation", count: orders.filter(o => o.status === "processing").length },
    { id: "shipped", label: "Expédiée", count: orders.filter(o => o.status === "shipped").length },
    { id: "delivering", label: "Livraison", count: orders.filter(o => o.status === "delivering").length },
    { id: "completed", label: "Livrée", count: orders.filter(o => o.status === "completed").length },
    { id: "cancelled", label: "Annulée", count: orders.filter(o => o.status === "cancelled").length },
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending": return { color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", label: "Validée", dot: "bg-emerald-500" };
      case "processing": return { color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", label: "Préparation", dot: "bg-blue-500" };
      case "shipped": return { color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200", label: "Expédiée", dot: "bg-purple-500" };
      case "delivering": return { color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", label: "Livraison", dot: "bg-amber-500" };
      case "completed": return { color: "text-emerald-900", bg: "bg-emerald-100", border: "border-emerald-300", label: "Livrée", dot: "bg-emerald-600" };
      case "cancelled": return { color: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200", label: "Annulée", dot: "bg-rose-500" };
      default: return { color: "text-slate-600", bg: "bg-slate-50", border: "border-slate-200", label: status, dot: "bg-slate-400" };
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <DashboardHeader 
        title="Flux Commandes"
        subtitle="Gestion logistique & Transactions"
        badge="Commandes"
        icon={ShoppingBag}
        action={
          <div className="flex items-center gap-3 px-5 py-3 bg-white border border-[#F2EBE1] rounded-2xl shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Séquence en Temps Réel</span>
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
              filter === tab.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
            <span className={`text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-black ${
              filter === tab.id ? "bg-primary text-white" : "bg-slate-200 text-slate-500"
            }`}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="py-24 text-center">
              <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <ShoppingBag size={22} className="text-slate-300" />
              </div>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.5em]">Aucune commande</p>
            </div>
          ) : (
            <table className="w-full text-left min-w-[900px]">
              <thead>
                <tr className="border-b border-slate-100 text-[9px] uppercase font-bold text-slate-400 tracking-[0.25em]">
                  <th className="px-8 py-5">Référence</th>
                  <th className="px-6 py-5">Client</th>
                  <th className="px-6 py-5">Produits</th>
                  <th className="px-6 py-5">Montant</th>
                  <th className="px-6 py-5 text-center">Statut</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((order: any) => {
                  const cfg = getStatusConfig(order.status);
                  const itemCount = order.items?.length || order.order_items?.length || 0;
                  const isUpdating = loading === order.id;
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/60 transition-colors group">
                      {/* Reference */}
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                            <Package size={15} className="text-slate-400" />
                          </div>
                          <div>
                            <p className="font-mono text-[11px] font-black text-slate-700 uppercase">ORD-{order.id.slice(0, 8).toUpperCase()}</p>
                            <p className="text-[9px] text-slate-400 font-bold">
                              {new Date(order.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                            </p>
                          </div>
                        </div>
                      </td>
                      {/* Client */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shrink-0 text-slate-500 font-black text-sm">
                            {(order.fullName || order.profiles?.first_name || order.shipping?.first_name || "A")[0]}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">
                              {order.fullName || `${order.profiles?.first_name || order.shipping?.first_name || "Client"} ${order.profiles?.last_name || order.shipping?.last_name || ""}`}
                            </p>
                            <p className="text-[9px] text-slate-400 font-bold truncate max-w-[120px]">
                              {order.email || order.profiles?.email || order.shipping?.email || "—"}
                            </p>
                          </div>
                        </div>
                      </td>
                      {/* Products */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <ShoppingBag size={13} className="text-slate-400 shrink-0" />
                          <span className="text-[11px] font-bold text-slate-600">{itemCount} article{itemCount > 1 ? "s" : ""}</span>
                        </div>
                        {order.items?.[0]?.title && (
                          <p className="text-[9px] text-slate-400 font-medium truncate max-w-[130px] mt-0.5">{order.items[0].title}</p>
                        )}
                      </td>
                      {/* Amount */}
                      <td className="px-6 py-5">
                        <span className="text-lg font-black text-slate-900">{Number(order.total_amount || 0).toLocaleString('fr-FR', { maximumFractionDigits: 2 })}</span>
                        <span className="text-[9px] font-bold text-primary ml-1 uppercase tracking-widest">DH</span>
                      </td>
                      {/* Status */}
                      <td className="px-6 py-5 text-center">
                        {isUpdating ? (
                          <div className="flex justify-center"><Loader2 size={16} className="animate-spin text-slate-400" /></div>
                        ) : (
                          <CustomSelect
                            options={[
                              { id: "pending", name: "Validée" },
                              { id: "processing", name: "Préparation" },
                              { id: "shipped", name: "Expédiée" },
                              { id: "delivering", name: "Livraison" },
                              { id: "completed", name: "Livrée" },
                              { id: "cancelled", name: "Annulée" },
                            ]}
                            value={order.status}
                            onChange={(val) => handleStatusChange(order.id, val || "pending")}
                            placeholder="Statut"
                            className="min-w-[140px]"
                          />
                        )}
                      </td>
                      {/* Actions */}
                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="w-9 h-9 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-primary hover:border-primary/30 hover:bg-pink-50 transition-all flex items-center justify-center ml-auto shadow-sm"
                          title="Voir les détails"
                        >
                          <Eye size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Mobile View: Cards */}
        <div className="md:hidden p-4 flex flex-col gap-4 bg-slate-50/30">
          {filtered.length === 0 ? (
            <div className="py-24 text-center">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm">
                <ShoppingBag size={22} className="text-slate-300" />
              </div>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.5em]">Aucune commande</p>
            </div>
          ) : (
            filtered.map((order: any) => {
              const cfg = getStatusConfig(order.status);
              const itemCount = order.items?.length || order.order_items?.length || 0;
              return (
                <div key={order.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div>
                       <p className="font-mono text-[11px] font-black text-slate-700 uppercase">ORD-{order.id.slice(0, 8).toUpperCase()}</p>
                       <p className="text-[9px] text-slate-400 font-bold">{new Date(order.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}</p>
                    </div>
                    <div className={`px-2.5 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                       {cfg.label}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-500 font-black text-xs shrink-0 border border-slate-100">
                        {(order.fullName || order.profiles?.first_name || order.shipping?.first_name || "A")[0]}
                     </div>
                     <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-900 truncate">{order.fullName || `${order.profiles?.first_name || order.shipping?.first_name || "Client"} ${order.profiles?.last_name || order.shipping?.last_name || ""}`}</p>
                        <p className="text-[9px] text-slate-400 font-bold max-w-[120px] truncate">{order.email || order.profiles?.email || order.shipping?.email || "—"}</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-[1.5rem] p-4 border border-slate-100/50">
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Montant</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-black text-slate-900">{Number(order.total_amount || 0).toLocaleString('fr-FR', { maximumFractionDigits: 2 })}</span>
                        <span className="text-[9px] font-black text-primary uppercase tracking-widest">DH</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Articles</p>
                      <div className="flex items-center gap-2 mt-0.5">
                         <ShoppingBag size={14} className="text-slate-400" />
                         <span className="text-sm font-black text-slate-700">{itemCount}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="w-full py-3.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-md shadow-slate-900/10 mt-1"
                  >
                    Voir Détails <Eye size={12} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between px-10 py-7 border-b border-slate-100">
              <div>
                <p className="font-mono text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">ORD-{selectedOrder.id.slice(0, 8).toUpperCase()}</p>
                <h2 className="text-2xl font-black text-slate-900">Détails Commande</h2>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-all">
                <X size={18} />
              </button>
            </div>

            <div className="p-10 space-y-8">
              {/* Status Banner */}
              {(() => { const cfg = getStatusConfig(selectedOrder.status); return (
                <div className={`flex items-center gap-3 p-4 rounded-2xl border ${cfg.bg} ${cfg.border}`}>
                  <div className={`w-3 h-3 rounded-full ${cfg.dot}`} />
                  <span className={`text-sm font-black uppercase tracking-widest ${cfg.color}`}>{cfg.label}</span>
                  <div className="ml-auto">
                    <CustomSelect
                      options={[
                        { id: "pending", name: "Validée" },
                        { id: "processing", name: "Préparation" },
                        { id: "shipped", name: "Expédiée" },
                        { id: "delivering", name: "Livraison" },
                        { id: "completed", name: "Livrée" },
                        { id: "cancelled", name: "Annulée" },
                      ]}
                      value={selectedOrder.status}
                      onChange={(val) => handleStatusChange(selectedOrder.id, val || "pending")}
                      placeholder="Statut"
                      className="min-w-[160px]"
                    />
                  </div>
                </div>
              )})()}

              {/* Client Info */}
              <div className="bg-slate-50 rounded-2xl p-6">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Informations Client</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <User size={14} className="text-slate-400 shrink-0" />
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Nom</p>
                      <p className="text-sm font-bold text-slate-900">
                        {selectedOrder.fullName || `${selectedOrder.profiles?.first_name || selectedOrder.shipping?.first_name || "—"} ${selectedOrder.profiles?.last_name || selectedOrder.shipping?.last_name || ""}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={14} className="text-slate-400 shrink-0" />
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Email</p>
                      <p className="text-sm font-bold text-slate-900">{selectedOrder.email || selectedOrder.profiles?.email || selectedOrder.shipping?.email || "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={14} className="text-slate-400 shrink-0" />
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Téléphone</p>
                      <p className="text-sm font-bold text-slate-900">{selectedOrder.phone || selectedOrder.shipping?.phone || selectedOrder.profiles?.phone || "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin size={14} className="text-slate-400 shrink-0" />
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Ville</p>
                      <p className="text-sm font-bold text-slate-900">{selectedOrder.city || selectedOrder.shipping?.city || "—"}</p>
                    </div>
                  </div>
                  {(selectedOrder.address || selectedOrder.shipping?.address) && (
                    <div className="col-span-2 flex items-start gap-3">
                      <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Adresse</p>
                        <p className="text-sm font-bold text-slate-900">{selectedOrder.address || selectedOrder.shipping?.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Products */}
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Articles Commandés</p>
                <div className="space-y-3">
                  {(selectedOrder.items || selectedOrder.order_items || []).map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl overflow-hidden flex-shrink-0">
                          <img 
                            src={item.image || item.products?.images?.[0] || item.products?.image_url || "https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=300"} 
                            alt="" 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{item.title || item.products?.title || `Article #${i + 1}`}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Qté: {item.quantity} × {Number(item.price_at_time || item.price).toLocaleString('fr-FR', { maximumFractionDigits: 2 })} DH</p>
                        </div>
                      </div>
                      <p className="font-black text-slate-900">{Number((item.quantity || 1) * (item.price_at_time || item.price)).toLocaleString('fr-FR', { maximumFractionDigits: 2 })} DH</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total + Date */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar size={14} />
                  <span className="text-[10px] font-bold">
                    {new Date(selectedOrder.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</p>
                  <p className="text-2xl font-black text-slate-900">{Number(selectedOrder.total_amount || 0).toLocaleString('fr-FR', { maximumFractionDigits: 2 })} <span className="text-sm">DH</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
