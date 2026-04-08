"use client";
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package, Calendar, ArrowUpRight, BarChart3, PieChart, Activity } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function AnalyticsClient({ stats }: { stats: any }) {
  // Mock data for curves if real data is flat
  const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"];
  const salesTrend = [4500, 5200, 4800, 6100, 5900, 7200];

  return (
    <div className="animate-fade-up">
      <DashboardHeader 
        title="Analyses de l'Atelier"
        subtitle="Analyse détaillée des performances au fil du temps"
        badge="Performances"
        icon={BarChart3}
        action={
          <div className="bg-white border border-[#F2EBE1] rounded-2xl px-6 py-3 flex items-center gap-3 shadow-sm">
            <Calendar size={14} className="text-slate-300" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">6 Derniers Mois</span>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Enhanced Stat Cards */}
          {[
            { label: "Chiffre d'Affaires", value: `${stats.totalSales.toLocaleString()} DH`, icon: DollarSign, trend: "+12.5%", positive: true },
            { label: "Transactions", value: stats.totalOrders, icon: ShoppingCart, trend: "+5.2%", positive: true },
            { label: "Clients", value: stats.totalCustomers, icon: Users, trend: "-2.1%", positive: false },
            { label: "Inventaire", value: stats.totalProducts, icon: Package, trend: "+45", positive: true, unit: " Nouveaux" },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.03)] flex flex-col gap-6">
               <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-100">
                     <stat.icon size={20} />
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] font-bold px-3 py-1 rounded-full ${stat.positive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-500 border border-rose-100'}`}>
                     {stat.positive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                     {stat.trend}
                  </div>
               </div>
               <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none mb-3">{stat.label}</p>
                  <p className="text-3xl font-playfair font-bold text-slate-900 leading-none">{stat.value}{stat.unit}</p>
               </div>
            </div>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
         {/* Main Chart Area Placeholder */}
         <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-100 shadow-sm p-10">
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h3 className="text-xl font-playfair font-bold text-slate-900">Trajectoire des <span className="text-rose-500">Revenus</span></h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Bénéfice net vs Coûts opérationnels</p>
               </div>
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-rose-500" />
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bénéfice</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-slate-200" />
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Coûts</span>
                  </div>
               </div>
            </div>
            
            <div className="h-64 flex items-end gap-4 px-4">
               {salesTrend.map((val, i) => (
                 <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                    <div 
                      className="w-full bg-rose-50 group-hover:bg-rose-100 transition-all rounded-2xl relative border border-rose-100/50" 
                      style={{ height: `${(val/8000)*100}%` }}
                    >
                       <div className="absolute inset-0 bg-gradient-to-t from-rose-500/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{months[i]}</span>
                 </div>
               ))}
            </div>
         </div>

         {/* Distribution Chart Placeholder */}
         <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-10 flex flex-col">
            <h3 className="text-xl font-playfair font-bold text-slate-900 mb-2">Répartition par <span className="text-rose-500">Catégorie</span></h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-10">Distribution des ventes par type de rituel</p>
            
            <div className="flex-1 flex items-center justify-center relative">
               <div className="w-48 h-48 rounded-full border-[10px] border-slate-50 flex items-center justify-center shadow-inner">
                  <div className="text-center">
                     <p className="text-2xl font-playfair font-bold text-slate-900">72%</p>
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Capillaires</p>
                  </div>
               </div>
               {/* Visual segments would go here */}
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <PieChart size={120} strokeWidth={0.5} className="text-rose-500/10 rotate-12" />
               </div>
            </div>

            <div className="space-y-4 mt-8">
               {[
                 { label: "Soins Kératine", value: "45%", color: "bg-rose-500" },
                 { label: "Matériel de Beauté", value: "30%", color: "bg-amber-500" },
                 { label: "Produits Coiffants", value: "25%", color: "bg-emerald-500" },
               ].map((item, i) => (
                 <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className={`w-2 h-2 rounded-full ${item.color}`} />
                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.label}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-900">{item.value}</span>
                 </div>
               ))}
            </div>
         </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-10">
         <div className="flex items-center justify-between mb-10">
            <div>
               <h3 className="text-xl font-playfair font-bold text-slate-900">Flux d'<span className="text-emerald-500 italic">Activité</span></h3>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Journaux d'opérations de l'atelier en temps réel</p>
            </div>
            <button className="text-[10px] font-bold text-rose-500 uppercase tracking-widest hover:underline">Voir Tout le Trafic</button>
         </div>

         <div className="space-y-6">
            {[
              { text: "Nouvelle commande #2640 reçue de Brooklyn Zoe", time: "il y a 2 minutes", icon: ShoppingCart, bg: "bg-rose-50 border border-rose-100", color: "text-rose-500" },
              { text: "Le stock de 'Élixir Doré' a atteint un niveau critique (4 unités)", time: "il y a 1 heure", icon: Activity, bg: "bg-amber-50 border border-amber-100", color: "text-amber-500" },
              { text: "Objectif de revenu mensuel (150k DH) dépassé de 12%", time: "il y a 3 heures", icon: TrendingUp, bg: "bg-emerald-50 border border-emerald-100", color: "text-emerald-500" },
            ].map((log, i) => (
              <div key={i} className="flex items-center gap-5 group">
                 <div className={`w-10 h-10 rounded-xl ${log.bg} ${log.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-sm`}>
                    <log.icon size={16} />
                 </div>
                 <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 font-medium truncate">{log.text}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{log.time}</p>
                 </div>
                 <ArrowUpRight size={16} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}
