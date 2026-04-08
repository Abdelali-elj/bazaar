"use client";
import React from 'react';
import { Bell, Lock, Eye, Globe, Moon } from 'lucide-react';

export default function UserSettingsPage() {
  const settings = [
    { title: "Notifications", desc: "Alertes sur vos commandes et nouveautés", icon: Bell },
    { title: "Sécurité", desc: "Mot de passe et authentification double facteur", icon: Lock },
    { title: "Confidentialité", desc: "Gérez la visibilité de votre profil", icon: Eye },
    { title: "Langues", desc: "Préférences de région et de langue", icon: Globe },
  ];

  return (
    <div className="animate-fade-up max-w-3xl">
      <div className="mb-12">
        <h1 className="text-5xl font-black text-foreground tracking-tighter uppercase leading-none mb-4">
          Configurations <span className="text-primary italic lowercase">Privées</span>
        </h1>
        <p className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.4em]">Ajustez votre expérience selon vos rituels.</p>
      </div>

      <div className="space-y-6">
        {settings.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="glass-card rounded-[3rem] border border-white/50 p-8 shadow-xl shadow-pink-200/10 flex items-center justify-between group hover:bg-white transition-all">
              <div className="flex items-center gap-8">
                 <div className="w-14 h-14 bg-pink-50 rounded-[1.5rem] flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-sm">
                    <Icon size={24} />
                 </div>
                 <div>
                    <h3 className="text-[13px] font-black text-foreground uppercase tracking-widest mb-1">{item.title}</h3>
                    <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">{item.desc}</p>
                 </div>
              </div>
              <div className="w-12 h-6 bg-pink-50 rounded-full p-1 cursor-pointer">
                 <div className="w-4 h-4 bg-white rounded-full shadow-md" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
