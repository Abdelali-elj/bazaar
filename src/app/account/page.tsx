"use client";
import React, { useEffect, useState } from 'react';
import { getUser } from '@/lib/actions/auth';
import { getOrders } from '@/lib/actions/orders';
import { 
  ShoppingBag, 
  Clock, 
  ArrowRight, 
  Package,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const u = await getUser();
      if (u) {
        setUser(u);
        const orders = await getOrders(u.id);
        setRecentOrders(orders?.slice(0, 3) || []);
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

  const stats = [
    { label: "Commandes", value: recentOrders.length, icon: ShoppingBag, color: "bg-blue-50 text-blue-600" },
    { label: "Dépenses", value: `${recentOrders.reduce((acc, o) => acc + (o.total_amount || 0), 0)} DH`, icon: CreditCard, color: "bg-emerald-50 text-emerald-600" },
    { label: "En cours", value: recentOrders.filter(o => o.status === 'pending').length, icon: Clock, color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div className="space-y-12 animate-fade-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-black text-foreground tracking-tighter uppercase leading-none mb-4">
            Bonjour, <span className="text-primary italic lowercase">{user?.profile?.first_name || 'Ami'}</span>
          </h1>
          <p className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.4em]">Bienvenue dans votre atelier personnel.</p>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 bg-white border border-pink-50 rounded-2xl shadow-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-black text-foreground/40 uppercase tracking-widest">Connecté en direct</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass-card rounded-[2.5rem] border border-white/50 p-8 shadow-xl shadow-pink-200/10 group hover:scale-105 transition-all">
              <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform`}>
                <Icon size={20} />
              </div>
              <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <h4 className="text-3xl font-black text-foreground tracking-tight">{stat.value}</h4>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="glass-card rounded-[3.5rem] border border-white/50 p-10 shadow-2xl shadow-pink-200/20">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-4">
            <span className="w-12 h-12 rounded-[1.5rem] bg-pink-50 flex items-center justify-center text-xl">📦</span>
            Dernières Pièces
          </h2>
          <Link href="/account/orders" className="text-[9px] font-black text-primary uppercase tracking-[0.3em] hover:opacity-70 transition-all border-b-2 border-primary/20 pb-1">Tout voir</Link>
        </div>

        <div className="space-y-6">
          {recentOrders.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-pink-50 rounded-[2.5rem]">
              <p className="text-[10px] font-black text-foreground/20 uppercase tracking-widest">Vous n'avez pas encore passé de commande.</p>
              <Link href="/products" className="btn-premium !py-4 !px-8 mt-6 inline-block">Découvrir la collection</Link>
            </div>
          ) : (
            recentOrders.map((order) => (
              <div key={order.id} className="flex flex-col md:flex-row items-center justify-between p-6 bg-pink-50/30 border border-white rounded-[2.5rem] hover:bg-pink-50/50 transition-all group">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-pink-50 flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                    <Package size={24} />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-foreground uppercase tracking-widest mb-1">Commande #{order.id.slice(0, 8)}</h4>
                    <p className="text-[9px] font-bold text-foreground/30 uppercase tracking-widest">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-12 mt-6 md:mt-0">
                  <div className="text-right">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      order.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {order.status === 'completed' ? 'Livré' : 'En attente'}
                    </span>
                  </div>
                  <div className="text-right min-w-[100px]">
                    <p className="text-xl font-black text-primary tracking-tighter">{order.total_amount} <span className="text-[10px]">DH</span></p>
                  </div>
                  <Link href={`/account/orders/${order.id}`} className="w-10 h-10 rounded-full border border-pink-100 flex items-center justify-center text-foreground/20 hover:text-primary hover:border-primary transition-all group-hover:translate-x-1">
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
