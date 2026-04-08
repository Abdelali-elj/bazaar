"use client";
import React from 'react';
import { MapPin, Plus, Home, Briefcase } from 'lucide-react';

export default function UserAddressesPage() {
  const addresses = [
    { title: "Résidence Principale", city: "Casablanca", address: "123 Boulevard d'Anfa, Appt 4", type: "Home" },
  ];

  return (
    <div className="animate-fade-up">
      <div className="mb-12">
        <h1 className="text-5xl font-black text-foreground tracking-tighter uppercase leading-none mb-4">
          Lieux de <span className="text-primary italic lowercase">Vie</span>
        </h1>
        <p className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.4em]">Vos sanctuaires de livraison enregistrés.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {addresses.map((addr, i) => (
          <div key={i} className="glass-card rounded-[3rem] border border-white/50 p-10 shadow-xl shadow-pink-200/10 group">
             <div className="flex justify-between items-start mb-8">
                <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-primary border border-white">
                   <Home size={20} />
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full">Par Défaut</span>
             </div>
             <h3 className="text-xl font-black text-foreground tracking-tight mb-2 uppercase">{addr.title}</h3>
             <p className="text-[11px] font-bold text-foreground/40 leading-relaxed mb-8">{addr.address}<br/>{addr.city}, Maroc</p>
             <button className="text-[9px] font-black text-primary uppercase tracking-widest border-b-2 border-primary/20 pb-1 hover:border-primary transition-all">Modifier l'adresse</button>
          </div>
        ))}

        <button className="rounded-[3rem] border-4 border-dashed border-pink-50 p-10 flex flex-col items-center justify-center gap-4 hover:bg-pink-50/50 hover:border-primary/20 transition-all group">
           <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-primary/20 group-hover:text-primary transition-colors shadow-sm">
              <Plus size={24} />
           </div>
           <p className="text-[10px] font-black text-foreground/20 uppercase tracking-widest group-hover:text-primary transition-colors">Ajouter un Sanctuaire</p>
        </button>
      </div>
    </div>
  );
}
