"use client";
import React, { useEffect, useState } from 'react';
import { 
  Heart, 
  ShoppingBag, 
  Trash2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { useFavorites } from '@/context/FavoritesContext';
import { db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';

export default function ClientFavoritesPage() {
  const { favorites, toggleFavorite } = useFavorites();
  const [favoriteProducts, setFavoriteProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      if (favorites.length === 0) {
        setFavoriteProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const productPromises = favorites.map(id => getDoc(doc(db, "products", id)));
        const productSnaps = await Promise.all(productPromises);
        const products = productSnaps
          .filter(snap => snap.exists())
          .map(snap => ({ id: snap.id, ...snap.data() }));
        setFavoriteProducts(products);
      } catch (error) {
        console.error("Error fetching favorite products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteProducts();
  }, [favorites]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-100 border-t-[#C9A96E] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#C9A96E]" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C9A96E]">Ma Sélection</span>
          </div>
          <h1 className="text-5xl font-black text-[#1A2E28] tracking-tighter uppercase leading-none font-outfit">
            Mes <span className="text-[#C9A96E] italic font-normal font-playfair lowercase">Favoris</span>
          </h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.4em] mt-4">Vos pièces d'exception réservées</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {favoriteProducts.length === 0 ? (
          <div className="sm:col-span-2 lg:col-span-3 bg-white rounded-[3rem] border border-[#F2EBE1] p-24 text-center shadow-sm relative overflow-hidden">
             <div className="relative z-10">
                <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-[#F2EBE1]">
                   <Heart size={32} className="text-slate-200" />
                </div>
                <h3 className="text-lg font-black text-[#1A2E28] uppercase tracking-wider mb-4">Votre liste est vide</h3>
                <p className="text-slate-400 text-sm mb-10 max-w-sm mx-auto leading-relaxed font-medium">
                  Parcourez nos rituels de beauté et collectionnez vos pièces favorites pour les retrouver ici.
                </p>
                <Link 
                  href="/products" 
                  className="inline-flex items-center gap-4 px-10 py-5 bg-[#1A2E28] text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-[#C9A96E] transition-all shadow-xl shadow-[#1A2E28]/10 group"
                >
                  Découvrir nos rituels
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
             </div>
             {/* Background Decoration */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.02] pointer-events-none select-none overflow-hidden">
                <div className="flex flex-wrap gap-10 p-10 text-[120px] font-black rotate-12">
                   FAVORIS BAZAAR STYLE SIGNATURE
                </div>
             </div>
          </div>
        ) : (
          favoriteProducts.map((product: any) => (
            <div key={product.id} className="group animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-slate-50 border border-[#F2EBE1] shadow-sm transform-gpu group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-700">
                <img 
                  src={product.image || product.images?.[0] || product.image_url} 
                   alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                
                {/* Floating Tags */}
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                   <div className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-lg text-[8px] font-black uppercase tracking-widest text-[#1A2E28] shadow-sm flex items-center gap-2">
                     <Sparkles size={10} className="text-[#C9A96E]" />
                     Pièce Unique
                   </div>
                </div>

                <div className="absolute top-6 right-6">
                  <button 
                    onClick={() => toggleFavorite(product.id)}
                    className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-rose-400 hover:bg-rose-500 hover:text-white transition-all shadow-sm group/btn"
                    title="Retirer des favoris"
                  >
                    <Trash2 size={18} className="group-hover/btn:scale-110 transition-transform" />
                  </button>
                </div>

                {/* Hover Overlay Actions */}
                <div className="absolute inset-x-6 bottom-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                   <Link
                    href={`/products/${product.slug || product.id}`}
                    className="w-full py-5 bg-[#1A2E28] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#C9A96E] transition-all flex items-center justify-center gap-4 shadow-2xl"
                   >
                    <ShoppingBag size={14} /> Ajouter au Panier
                  </Link>
                </div>
              </div>
              
              <div className="mt-8 px-2 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-base font-black text-[#1A2E28] uppercase tracking-tight group-hover:text-[#C9A96E] transition-colors font-outfit">{product.title}</h4>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1 font-dm-sans">Rituel Signature Bazaar</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-[#1A2E28] tracking-tighter">{product.price} <span className="text-xs text-[#C9A96E] font-bold">DH</span></p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
