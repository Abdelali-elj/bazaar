"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  User, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  LogOut, 
  Settings,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { signOut } from '@/lib/actions/auth';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: "Vue d'ensemble", href: "/account", icon: Sparkles },
    { label: "Mes Commandes", href: "/account/orders", icon: ShoppingBag },
    { label: "Mes Favoris", href: "/account/favorites", icon: Heart },
    { label: "Mon Profil", href: "/account/profile", icon: User },
    { label: "Adresses", href: "/account/addresses", icon: MapPin },
    { label: "Paramètres", href: "/account/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#FFF7FB] pt-32 pb-20">
      <div className="container-wide px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="glass-card rounded-[3rem] border border-white/50 p-8 shadow-2xl shadow-pink-200/20 sticky top-32">
              <div className="mb-10 text-center">
                <div className="w-20 h-20 rounded-[2.5rem] bg-pink-100 flex items-center justify-center mx-auto mb-4 border border-white shadow-lg overflow-hidden">
                  <User size={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-black text-foreground tracking-tight">Mon Espace</h3>
                <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mt-1">Client Privilégié</p>
              </div>

              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between w-full p-4 rounded-2xl transition-all group ${
                        isActive 
                          ? "bg-primary text-white shadow-xl shadow-pink-200" 
                          : "text-foreground/40 hover:text-primary hover:bg-pink-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={18} className={isActive ? "text-white" : "group-hover:scale-110 transition-transform"} />
                        <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                      </div>
                      <ChevronRight size={14} className={isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100 transition-all text-primary/30"} />
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-10 pt-10 border-t border-pink-50">
                <button 
                  onClick={() => signOut()}
                  className="w-full flex items-center gap-3 p-4 text-[11px] font-black uppercase tracking-widest text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all group"
                >
                  <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                  Déconnexion
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}
