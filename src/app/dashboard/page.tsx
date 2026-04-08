"use client";
import { useState, useEffect } from "react";
import { getDashboardStats } from "@/lib/actions/orders";
import Link from "next/link";
import { DollarSign, Package, Clock, Users, ArrowUpRight, ShoppingBag, TrendingUp, Activity, Filter } from "lucide-react";
import DashboardCharts from "@/components/dashboard/DashboardCharts";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats().then(res => {
      setStats(res);
      setLoading(false);
    }).catch(() => {
      setStats({
        totalRevenue: 0, totalOrders: 0, pendingOrders: 0,
        totalProducts: 0, totalCustomers: 0, recentOrders: [],
      });
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
      <div className="relative">
         <div className="w-16 h-16 border-2 border-slate-100 border-t-primary rounded-full animate-spin" />
         <div className="absolute inset-0 flex items-center justify-center">
            <Activity size={20} className="text-primary animate-pulse" />
         </div>
      </div>
      <div className="text-primary/40 text-[10px] font-black tracking-[0.6em] animate-pulse uppercase">Immersion dans l'Atelier...</div>
    </div>
  );

  const statCards = [
    { label: "Volume d'Affaires", value: `${stats.totalRevenue.toLocaleString()} DH`, icon: DollarSign, trend: "+12.5%", color: "text-slate-900", iconBg: "bg-pink-50", iconColor: "text-primary" },
    { label: "Flux de Commandes", value: stats.totalOrders, icon: ShoppingBag, trend: "+5.2%", color: "text-slate-900", iconBg: "bg-rose-50/50", iconColor: "text-primary/60" },
    { label: "En Séquençage", value: stats.pendingOrders, icon: Clock, trend: "-2.1%", color: "text-amber-600", iconBg: "bg-amber-50", iconColor: "text-amber-600" },
    { label: "Cercles Privés", value: stats.totalCustomers, icon: Users, trend: "+8", color: "text-slate-900", iconBg: "bg-pink-50/20", iconColor: "text-primary/40" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight italic font-playfair">
            Vue <span className="text-primary italic">Atelier</span>
          </h1>
          <p className="text-primary/40 text-[10px] font-bold uppercase tracking-[0.4em] mt-1.5">Activité du Sanctuaire en temps réel</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
           <Link href="/dashboard/settings" className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 text-white shadow-lg shadow-slate-900/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all">
              <Activity size={14} />
              Paramètres
           </Link>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden">
               <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 ${card.iconBg} rounded-xl flex items-center justify-center ${card.iconColor} transition-transform group-hover:scale-110`}>
                     <Icon size={18} />
                  </div>
                  <span className={`text-[9px] font-black px-2 py-1 rounded-full ${card.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                     {card.trend}
                  </span>
               </div>
               <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
                  <span className={`text-2xl font-black ${card.color}`}>{card.value}</span>
               </div>
            </div>
          );
        })}
      </div>

      {/* CHARTS SECTION */}
      <DashboardCharts />

      {/* STOCK & TOP SELLERS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
         {/* Low Stock Alert - Takes up 7 cols */}
         <div className="lg:col-span-7 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-lg font-bold text-slate-900">Alertes <span className="text-rose-500">Stock</span></h3>
               <Link href="/dashboard/products" className="text-[9px] font-bold text-blue-600 uppercase tracking-widest hover:underline">Gérer l'inventaire</Link>
            </div>
            <div className="space-y-6">
               {[
                 { label: "Huile d'Argan Bio 50ml", value: 4, max: 100, color: "bg-rose-500" },
                 { label: "Savon Noir Eucalyptus", value: 12, max: 100, color: "bg-amber-500" },
                 { label: "Pack Découverte", value: 15, max: 100, color: "bg-blue-500" },
               ].map((item, i) => (
                 <div key={i} className="space-y-2">
                    <div className="flex justify-between items-end">
                       <span className="text-xs font-bold text-slate-700">{item.label}</span>
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{item.value} unités restants</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                       <div className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${(item.value / item.max) * 100}%` }} />
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Top Sellers - Takes up 5 cols */}
         <div className="lg:col-span-5 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
            <h3 className="text-lg font-black text-slate-900 mb-8 italic font-playfair">Signatures <span className="text-primary italic">Majeures</span></h3>
            <div className="space-y-4">
               {[
                 { label: "Sérum Anti-Âge", count: 184 },
                 { label: "Gommage Corporel", count: 124 },
                 { label: "Crème Hydratante", count: 96 },
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group cursor-pointer">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 border border-slate-100 flex items-center justify-center text-sm font-black group-hover:bg-white transition-all">
                       #{i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className="text-sm font-bold text-slate-900 truncate">{item.label}</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{item.count} ventes</p>
                    </div>
                    <ArrowUpRight size={16} className="text-slate-300 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* RECENT ORDERS TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-10 py-8 border-b border-rose-100 flex justify-between items-center bg-pink-50/10">
          <h2 className="text-lg font-black text-slate-900 italic font-playfair">
            Dernières <span className="text-primary italic">Signatures</span>
          </h2>
          <Link 
            href="/dashboard/orders" 
            className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors"
          >
            Tout voir
          </Link>
        </div>
        
        <div className="hidden md:block overflow-x-auto">
          {!stats || stats.recentOrders.length === 0 ? (
            <div className="py-20 text-center">
               <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-50">
                  <ShoppingBag size={20} className="text-slate-300" />
               </div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aucune commande récente</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[9px] uppercase font-black text-slate-400 tracking-widest">
                   <th className="px-8 py-4">ID</th>
                   <th className="px-8 py-4">Client</th>
                   <th className="px-8 py-4">Montant</th>
                   <th className="px-8 py-4 text-center">Statut</th>
                   <th className="px-8 py-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {stats.recentOrders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-all group cursor-default">
                    <td className="px-8 py-5">
                       <span className="font-mono text-[10px] text-slate-400">#{order.id.slice(0, 8).toUpperCase()}</span>
                    </td>
                    <td className="px-8 py-5">
                       <p className="text-xs font-bold text-slate-900">{order.customer_name || 'Client Web'}</p>
                       <p className="text-[9px] text-slate-400">{order.customer_email || 'bazaar@style.ma'}</p>
                    </td>
                    <td className="px-8 py-5">
                       <span className="text-sm font-black text-slate-900">{order.total_amount?.toLocaleString()} <span className="text-[10px] text-primary italic font-black uppercase tracking-widest opacity-40">DH</span></span>
                    </td>
                    <td className="px-8 py-5">
                       <div className="flex justify-center">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest
                            ${order.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 
                              order.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'}
                          `}>
                            {order.status === 'completed' ? 'Livré' : order.status === 'pending' ? 'Attente' : order.status}
                          </span>
                       </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <div className="flex flex-col items-end">
                          <span className="text-xs font-bold text-slate-700">{new Date(order.created_at).toLocaleDateString('fr-FR')}</span>
                          <span className="text-[9px] text-slate-400">{new Date(order.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Mobile View: Cards */}
        <div className="md:hidden p-4 flex flex-col gap-4 bg-slate-50/30">
          {!stats || stats.recentOrders.length === 0 ? (
             <div className="py-20 text-center">
               <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm">
                  <ShoppingBag size={20} className="text-slate-300" />
               </div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aucune commande récente</p>
             </div>
          ) : (
            stats.recentOrders.map((order: any) => (
              <Link href="/dashboard/orders" key={order.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col gap-4 block">
                 <div className="flex items-start justify-between">
                    <div>
                       <span className="font-mono text-[10px] text-slate-400">#{order.id.slice(0, 8).toUpperCase()}</span>
                       <p className="text-xs font-bold text-slate-900 mt-1">{order.customer_name || 'Client Web'}</p>
                    </div>
                    <div className="text-right">
                       <span className="text-base font-black text-slate-900">{order.total_amount?.toLocaleString()} <span className="text-[9px] text-primary italic font-black uppercase tracking-widest opacity-40">DH</span></span>
                       <p className="text-[10px] text-slate-400">{new Date(order.created_at).toLocaleDateString('fr-FR')}</p>
                    </div>
                 </div>
                 <div className="flex items-center justify-between mt-2 pt-4 border-t border-slate-50">
                    <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest
                        ${order.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 
                          order.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'}
                    `}>
                        {order.status === 'completed' ? 'Livré' : order.status === 'pending' ? 'Attente' : order.status}
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary flex items-center gap-1">Voir <ArrowUpRight size={12} /></span>
                 </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
