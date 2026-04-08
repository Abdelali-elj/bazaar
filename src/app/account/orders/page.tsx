"use client";
import React, { useEffect, useState } from 'react';
import { getUser } from '@/lib/actions/auth';
import { getOrders } from '@/lib/actions/orders';
import { 
  Package, 
  ArrowRight, 
  ChevronRight,
  ShoppingBag
} from 'lucide-react';
import Link from 'next/link';

export default function UserOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const u = await getUser();
      if (u) {
        const data = await getOrders(u.id);
        setOrders(data || []);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-pink-100 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <div className="mb-12">
        <h1 className="text-5xl font-black text-foreground tracking-tighter uppercase leading-none mb-4">
          Historique des <span className="text-primary italic lowercase">Pièces</span>
        </h1>
        <p className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.4em]">Suivez le voyage de vos acquisitions.</p>
      </div>

      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="py-32 text-center glass-card rounded-[4rem] border border-pink-50">
             <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-white">
                <ShoppingBag size={32} className="text-primary/20" />
             </div>
             <p className="text-sm font-black text-foreground/20 uppercase tracking-[0.3em]">Votre historique est vierge.</p>
             <Link href="/products" className="btn-premium !py-5 !px-12 mt-10 inline-block">Commencer l'Expérience</Link>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="glass-card rounded-[3rem] border border-white/50 p-8 shadow-xl shadow-pink-200/10 hover:shadow-2xl hover:shadow-pink-200/20 transition-all group">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-pink-50 flex items-center justify-center text-primary shadow-sm border border-white group-hover:scale-110 transition-transform">
                    <Package size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-[11px] font-black text-foreground uppercase tracking-widest">ORD-{order.id.slice(0, 8).toUpperCase()}</h4>
                      <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                        order.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {order.status === 'completed' ? 'Livré' : 'En attente'}
                      </span>
                    </div>
                    <p className="text-[9px] font-bold text-foreground/30 uppercase tracking-widest">Acquis le {new Date(order.created_at).toLocaleDateString("fr-FR")}</p>
                  </div>
                </div>

                <div className="flex items-center gap-12 w-full md:w-auto border-t md:border-t-0 border-pink-50 pt-6 md:pt-0">
                  <div className="flex-1 md:flex-none">
                    <p className="text-[9px] font-black text-foreground/20 uppercase tracking-widest mb-1">Total</p>
                    <p className="text-2xl font-black text-primary tracking-tighter">{order.total_amount?.toLocaleString()} <span className="text-[10px]">DH</span></p>
                  </div>
                  
                  <Link 
                    href={`/account/orders/${order.id}`}
                    className="flex items-center gap-4 py-4 px-8 bg-white border border-pink-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-primary hover:border-primary hover:bg-pink-50 transition-all group/btn"
                  >
                    Détails <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
