"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Boxes, Filter, ArrowUp, ArrowDown, AlertTriangle, CheckCircle2, Package, RefreshCw } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function StockClient({ products: initial }: { products: any[] }) {
  const [products, setProducts] = useState(initial);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setProducts(initial);
  }, [initial]);

  const filtered = products.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleStockUpdate = async (id: string, newStock: number) => {
    if (newStock < 0) return;
    setLoading(id);
    const res = await fetch("/api/products/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, stock_quantity: newStock }),
    });
    if (res.ok) {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, stock_quantity: newStock } : p));
      router.refresh();
    }
    setLoading(null);
  };

  return (
    <div className="animate-fade-up">
      <DashboardHeader 
        title="Gestion Atelier"
        subtitle="Suivi des Niveaux & Disponibilité Exclusive"
        badge="Stock"
        icon={Boxes}
        action={
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-8 py-3 bg-white border border-[#F2EBE1] rounded-2xl shadow-sm text-[10px] font-black uppercase tracking-widest text-[#1A2E28] hover:bg-[#1A2E28] hover:text-white transition-all">
                <Filter size={14} />
                Filtrer les Flux
             </button>
             <button onClick={() => router.refresh()} className="p-3 bg-white border border-[#F2EBE1] rounded-2xl shadow-sm text-slate-400 hover:text-[#1A2E28] hover:bg-slate-50 transition-all">
                <RefreshCw size={18} />
             </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Stats Summary */}
          {[
            { label: "Total des Articles", value: products.length, icon: Package, color: "text-slate-600", bg: "bg-slate-50", border: "border-slate-100" },
            { label: "Stock Faible", value: products.filter(p => p.stock_quantity <= 10 && p.stock_quantity > 0).length, icon: AlertTriangle, color: "text-primary", bg: "bg-pink-50", border: "border-rose-100" },
            { label: "Rupture de Stock", value: products.filter(p => p.stock_quantity === 0).length, icon: Boxes, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
            { label: "Stock Sain", value: products.filter(p => p.stock_quantity > 10).length, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-5">
               <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} border ${stat.border} flex items-center justify-center`}>
                  <stat.icon size={20} />
               </div>
               <div>
                  <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest leading-none mb-1.5">{stat.label}</p>
                  <p className="text-2xl font-black text-slate-900 leading-none">{stat.value}</p>
               </div>
            </div>
          ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="relative w-full sm:w-96 group">
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Rechercher un produit..." 
              className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-6 text-sm focus:outline-none focus:border-[#8ba44a]/30 transition-all text-slate-900 font-medium placeholder:text-slate-400 shadow-sm"
            />
            <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#8ba44a] transition-colors" />
          </div>
        </div>

        <div className="hidden md:block overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white text-[10px] uppercase font-bold text-slate-400 tracking-[0.3em] border-b border-slate-100">
                <th className="px-10 py-6">Détails du Produit</th>
                <th className="px-10 py-6">Statut</th>
                <th className="px-10 py-6">Stock Actuel</th>
                <th className="px-10 py-6 text-right">Gestion Rapide</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-10 py-7">
                    <div className="font-playfair text-lg text-slate-900 font-medium tracking-tight mb-0.5">{p.title}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{p.categories?.name || "Collection Non Catégorisée"}</div>
                  </td>
                  <td className="px-10 py-7">
                    {p.stock_quantity === 0 ? (
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-[10px] font-bold uppercase tracking-widest border border-rose-100">
                         <Boxes size={12} /> Rupture
                      </span>
                    ) : p.stock_quantity <= 10 ? (
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-widest border border-amber-100">
                         <AlertTriangle size={12} /> Faible
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest border border-emerald-100">
                         <CheckCircle2 size={12} /> Sain
                      </span>
                    )}
                  </td>
                  <td className="px-10 py-7">
                    <div className="flex items-center gap-3">
                       <span className={`text-2xl font-playfair font-bold ${p.stock_quantity <= 10 ? 'text-rose-500' : 'text-slate-900'}`}>{p.stock_quantity}</span>
                       <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Unités Restantes</span>
                    </div>
                  </td>
                  <td className="px-10 py-7">
                    <div className="flex justify-end items-center gap-3">
                       <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-200">
                          <button 
                            onClick={() => handleStockUpdate(p.id, p.stock_quantity - 1)}
                            disabled={loading === p.id || p.stock_quantity === 0}
                            className="w-10 h-10 rounded-lg bg-white text-slate-500 hover:text-rose-500 hover:bg-slate-50 transition-all flex items-center justify-center border border-slate-100 disabled:opacity-30 shadow-sm"
                          >
                             <ArrowDown size={14} />
                          </button>
                          <div className="w-12 text-center text-xs font-bold text-slate-900">{loading === p.id ? '...' : p.stock_quantity}</div>
                          <button 
                            onClick={() => handleStockUpdate(p.id, p.stock_quantity + 1)}
                            disabled={loading === p.id}
                            className="w-10 h-10 rounded-lg bg-white text-slate-500 hover:text-emerald-500 hover:bg-slate-50 transition-all flex items-center justify-center border border-slate-100 shadow-sm"
                          >
                             <ArrowUp size={14} />
                          </button>
                       </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Cards */}
        <div className="md:hidden p-4 flex flex-col gap-4 bg-slate-50/30">
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm">
                 <Package size={20} className="text-slate-300" />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aucun produit</p>
            </div>
          ) : (
            filtered.map((p) => (
              <div key={p.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col gap-4">
                 <div className="flex items-start justify-between">
                    <div>
                      <div className="font-playfair text-lg text-slate-900 font-medium tracking-tight mb-0.5 max-w-[200px] truncate">{p.title}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate max-w-[200px]">{p.categories?.name || "Sans Catégorie"}</div>
                    </div>
                    <div>
                      {p.stock_quantity === 0 ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 text-[9px] font-black uppercase tracking-widest border border-rose-100">
                           <Boxes size={10} /> Rupture
                        </span>
                      ) : p.stock_quantity <= 10 ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 text-[9px] font-black uppercase tracking-widest border border-amber-100">
                           <AlertTriangle size={10} /> Faible
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                           <CheckCircle2 size={10} /> Sain
                        </span>
                      )}
                    </div>
                 </div>

                 <div className="flex items-center justify-between mt-2 pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                       <span className={`text-2xl font-playfair font-black ${p.stock_quantity <= 10 ? 'text-rose-500' : 'text-slate-900'}`}>{p.stock_quantity}</span>
                       <span className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-tight">Unités<br/>Restantes</span>
                    </div>

                    <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-200">
                       <button 
                         onClick={() => handleStockUpdate(p.id, p.stock_quantity - 1)}
                         disabled={loading === p.id || p.stock_quantity === 0}
                         className="w-10 h-10 rounded-lg bg-white text-slate-500 hover:text-rose-500 hover:bg-slate-50 transition-all flex items-center justify-center border border-slate-100 disabled:opacity-30 shadow-sm"
                       >
                          <ArrowDown size={14} />
                       </button>
                       <div className="w-12 text-center text-xs font-black text-slate-900">{loading === p.id ? '...' : p.stock_quantity}</div>
                       <button 
                         onClick={() => handleStockUpdate(p.id, p.stock_quantity + 1)}
                         disabled={loading === p.id}
                         className="w-10 h-10 rounded-lg bg-white text-slate-500 hover:text-emerald-500 hover:bg-slate-50 transition-all flex items-center justify-center border border-slate-100 shadow-sm"
                       >
                          <ArrowUp size={14} />
                       </button>
                    </div>
                 </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
