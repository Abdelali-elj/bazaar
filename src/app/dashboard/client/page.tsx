"use client";
import { useState, useEffect } from "react";
import { getUser } from "@/lib/actions/auth";
import { db } from "@/lib/firebase/config";
import { doc, getDoc, updateDoc, collection, query, where, getDocs, limit, orderBy } from "firebase/firestore";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Loader2, 
  Save, 
  CheckCircle2, 
  ShoppingBag, 
  Heart, 
  MessageSquare,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { useFavorites } from "@/context/FavoritesContext";
import { useCart } from "@/components/CartContext";

export default function ClientProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [stats, setStats] = useState({ orders: 0, lastOrder: null as any });
  const { favorites } = useFavorites();
  const { cart } = useCart();
  
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    getUser().then(async (u) => {
      if (!u) {
        setLoading(false);
        return;
      }
      setUser(u);
      try {
        // Fetch Profile
        const docRef = doc(db, "users", u.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            phone: data.phone || "",
            address: data.address || "",
          });
        }

        // Fetch Stats
        const q = query(collection(db, "orders"), where("user_id", "==", u.uid));
        const orderSnaps = await getDocs(q);
        const fetchedOrders = orderSnaps.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Sort client-side to avoid composite index requirement
        fetchedOrders.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        
        setStats({
          orders: fetchedOrders.length,
          lastOrder: fetchedOrders[0] || null
        });

      } catch (err) {
        console.error("Error fetching user dashboard data:", err);
      } finally {
        setLoading(false);
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setSuccess(false);
    try {
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        address: formData.address,
        updated_at: new Date().toISOString()
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-slate-100 border-t-[#C9A96E] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 animate-in fade-in duration-1000">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#C9A96E]" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C9A96E]">Espace Client</span>
          </div>
          <h1 className="text-5xl font-black text-[#1A2E28] tracking-tighter uppercase leading-none font-outfit">
            Mon <span className="text-[#C9A96E] italic font-normal font-playfair lowercase">Compte</span>
          </h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.4em] mt-4">Bienvenue dans votre univers Bazaar</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-[#F2EBE1] shadow-sm">
           <ShieldCheck size={16} className="text-emerald-500" />
           <span className="text-[9px] font-black uppercase tracking-widest text-[#1A2E28]">Compte Vérifié Signature</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: "Commandes", value: stats.orders, icon: ShoppingBag, color: "bg-emerald-50 text-emerald-600", link: "/dashboard/client/orders" },
           { label: "Favoris", value: favorites.length, icon: Heart, color: "bg-rose-50 text-rose-500", link: "/dashboard/client/favorites" },
           { label: "Panier", value: cart.length, icon: ShoppingBag, color: "bg-amber-50 text-amber-600", link: "/products" },
         ].map((stat, i) => (
           <Link key={i} href={stat.link} className="bg-white p-8 rounded-[2.5rem] border border-[#F2EBE1] shadow-sm group hover:shadow-xl transition-all duration-500">
              <div className="flex justify-between items-start mb-6">
                 <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center border border-current/10 shadow-sm transition-transform group-hover:scale-110`}>
                    <stat.icon size={22} />
                 </div>
                 <ArrowRight size={14} className="text-slate-200 group-hover:text-[#C9A96E] group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-3xl font-black text-[#1A2E28] tracking-tighter mb-1">{stat.value}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
           </Link>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Profile Form */}
        <div className="lg:col-span-7 bg-white rounded-[3rem] border border-[#F2EBE1] shadow-sm p-10 md:p-14 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A96E]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <form onSubmit={handleSubmit} className="relative z-10 space-y-10">
            <div className="flex items-center gap-8 pb-10 border-b border-slate-50">
              <div className="w-24 h-24 rounded-[2rem] bg-slate-50 border-4 border-white shadow-2xl flex items-center justify-center text-[#C9A96E] transform rotate-3">
                <User size={40} />
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-black text-[#1A2E28] uppercase tracking-tight font-outfit leading-none">{formData.first_name || "Nom"} {formData.last_name || "Complet"}</p>
                <div className="flex items-center gap-3 text-slate-400">
                  <Mail size={14} />
                  <span className="text-[11px] font-bold uppercase tracking-wider">{user?.email}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Prénom</label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={e => setFormData({...formData, first_name: e.target.value})}
                  className="w-full bg-[#FCFBF9] border border-[#F2EBE1] rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-[#C9A96E]/5 focus:border-[#C9A96E] transition-all text-[#1A2E28] font-medium"
                  placeholder="Votre prénom"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Nom</label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={e => setFormData({...formData, last_name: e.target.value})}
                  className="w-full bg-[#FCFBF9] border border-[#F2EBE1] rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-[#C9A96E]/5 focus:border-[#C9A96E] transition-all text-[#1A2E28] font-medium"
                  placeholder="Votre nom"
                />
              </div>
              <div className="space-y-3 md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Téléphone personnel</label>
                <div className="relative">
                  <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-[#C9A96E]" size={16} />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-[#FCFBF9] border border-[#F2EBE1] rounded-2xl pl-14 pr-6 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-[#C9A96E]/5 focus:border-[#C9A96E] transition-all text-[#1A2E28] font-medium"
                    placeholder="+212 6 XX XX XX XX"
                  />
                </div>
              </div>
              <div className="space-y-3 md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Adresse de livraison par défaut</label>
                <div className="relative">
                  <MapPin className="absolute left-6 top-5 text-[#C9A96E]" size={16} />
                  <textarea
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    className="w-full bg-[#FCFBF9] border border-[#F2EBE1] rounded-2xl pl-14 pr-6 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-[#C9A96E]/5 focus:border-[#C9A96E] transition-all text-[#1A2E28] min-h-[120px] resize-none font-medium leading-relaxed"
                    placeholder="Votre adresse complète pour nos livreurs"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between">
              <div className="min-h-[20px]">
                {success && (
                  <div className="flex items-center gap-3 text-emerald-600 text-[11px] font-black uppercase tracking-widest animate-in slide-in-from-bottom-2">
                    <CheckCircle2 size={16} />
                    <span>Profil Signature Mis à jour</span>
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-4 px-10 py-5 bg-[#1A2E28] text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.25em] hover:bg-[#C9A96E] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 shadow-xl shadow-[#1A2E28]/10"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Mettre à jour
              </button>
            </div>
          </form>
        </div>

        {/* Right Info: Recent Activity */}
        <div className="lg:col-span-5 space-y-6">
           {/* Recent Order Card */}
           <div className="bg-[#1A2E28] rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10">
                 <div className="flex justify-between items-center mb-10">
                    <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/10">
                       Dernier Achat
                    </div>
                    {stats.lastOrder && (
                       <span className={`w-2 h-2 rounded-full ${stats.lastOrder.status === 'completed' ? 'bg-emerald-400' : 'bg-[#C9A96E] animate-pulse'}`} />
                    )}
                 </div>
                 
                 {stats.lastOrder ? (
                   <div className="space-y-6">
                      <div>
                         <p className="text-3xl font-black tracking-tighter mb-1 uppercase font-outfit">ORD-{stats.lastOrder.id.slice(0, 8)}</p>
                         <p className="text-[10px] font-black text-[#C9A96E] uppercase tracking-widest">Rituel Signature</p>
                      </div>
                      <Link 
                        href={`/dashboard/client/orders/${stats.lastOrder.id}`}
                        className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all"
                      >
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#1A2E28]">
                               <ShoppingBag size={18} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest">Suivre l'expédition</span>
                         </div>
                         <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                   </div>
                 ) : (
                   <div className="py-10 text-center opacity-40">
                      <ShoppingBag size={48} className="mx-auto mb-4" />
                      <p className="text-xs font-bold uppercase tracking-widest">Aucune commande récente</p>
                   </div>
                 )}
              </div>
              {/* Background Ornament */}
              <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none select-none">
                 <ShoppingBag size={180} />
              </div>
           </div>

           {/* Support Link */}
           <div className="bg-white rounded-[2.5rem] p-8 border border-[#F2EBE1] flex items-center justify-between group cursor-pointer hover:border-[#C9A96E]/50 transition-all shadow-sm">
               <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-[#FCFBF9] rounded-2xl flex items-center justify-center text-[#C9A96E] border border-[#F2EBE1] group-hover:bg-[#C9A96E] group-hover:text-white transition-all">
                     <MessageSquare size={24} />
                  </div>
                  <div>
                     <p className="text-sm font-black text-[#1A2E28] uppercase tracking-tight font-outfit">Conciergerie Bazaar</p>
                     <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Support en direct</p>
                  </div>
               </div>
               <Link href="/dashboard/client/support">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-[#C9A96E] group-hover:bg-[#C9A96E]/5 transition-all">
                     <ArrowRight size={16} />
                  </div>
               </Link>
           </div>

           {/* Membership Info */}
           <div className="bg-[#FCFBF9] rounded-[2.5rem] p-8 border border-[#F2EBE1] relative overflow-hidden">
              <div className="relative z-10 flex flex-col items-center text-center">
                 <div className="w-16 h-1 bg-[#C9A96E] rounded-full mb-6" />
                 <h4 className="text-[11px] font-black text-[#1A2E28] uppercase tracking-[0.3em] mb-4">Privilèges Signature</h4>
                 <p className="text-[11px] text-slate-400 font-medium leading-relaxed mb-6">
                    En tant que membre Bazaar Style, vous bénéficiez d'un accès prioritaire à nos nouvelles collections et de la livraison offerte sur tous vos rituels.
                 </p>
                 <div className="px-6 py-2 bg-white border border-[#F2EBE1] rounded-full text-[9px] font-black uppercase tracking-widest text-[#C9A96E]">
                    Membre Excellence
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
