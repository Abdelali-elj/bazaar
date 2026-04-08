"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, ChevronDown, ArrowLeft, Menu, X, LayoutDashboard, ShoppingBag, Package, FolderTree, Users, Settings, MessageSquare, Heart, Tag, Ticket, Clock, Home } from "lucide-react";
import { signOut } from "@/lib/actions/auth";

interface DashboardClientLayoutProps {
  children: React.ReactNode;
  user: any;
  role: string;
}

// Nav links mirrored here to avoid client/server mismatch
const allLinks = [
  { href: "/dashboard", label: "Tableau de Bord", icon: LayoutDashboard, roles: ['super_admin', 'owner', 'staff'] },
  { href: "/dashboard/orders", label: "Commandes", icon: ShoppingBag, roles: ['super_admin', 'owner', 'staff'] },
  { href: "/dashboard/products", label: "Produits", icon: Package, roles: ['super_admin', 'owner', 'staff'] },
  { href: "/dashboard/categories", label: "Catégories", icon: FolderTree, roles: ['super_admin', 'owner'] },
  { href: "/dashboard/offers", label: "Offres", icon: Tag, roles: ['super_admin', 'owner'] },
  { href: "/dashboard/promo-codes", label: "Codes Promo", icon: Ticket, roles: ['super_admin', 'owner'] },
  { href: "/dashboard/users", label: "Équipe & Clients", icon: Users, roles: ['super_admin', 'owner'] },
  { href: "/dashboard/historique", label: "Historique", icon: Clock, roles: ['super_admin', 'owner', 'staff'] },
  { href: "/dashboard/support", label: "Support", icon: MessageSquare, roles: ['super_admin', 'owner', 'staff'] },
  { href: "/dashboard/settings", label: "Paramètres", icon: Settings, roles: ['super_admin', 'owner'] },
  { href: "/dashboard/client", label: "Profil", icon: Users, roles: ['customer'] },
  { href: "/dashboard/client/favorites", label: "Favoris", icon: Heart, roles: ['customer'] },
  { href: "/dashboard/client/orders", label: "Mes Achats", icon: ShoppingBag, roles: ['customer'] },
  { href: "/dashboard/client/support", label: "Support", icon: MessageSquare, roles: ['customer'] },
];

function NavLink({ href, label, Icon, isActive, onClick }: any) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group relative flex items-center gap-4 px-5 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 rounded-2xl
        ${isActive
          ? "text-[#1A2E28] bg-[#C9A96E]/15"
          : "text-slate-400 hover:text-[#1A2E28] hover:bg-slate-50"
        }`}
    >
      {isActive && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-7 bg-[#C9A96E] rounded-l-full shadow-[0_0_12px_rgba(201,169,110,0.5)]" />
      )}
      <Icon size={17} className={`transition-all duration-300 flex-shrink-0 ${isActive ? 'text-[#C9A96E]' : 'text-slate-300 group-hover:text-[#1A2E28]'}`} />
      <span className="flex-1 truncate">{label}</span>
    </Link>
  );
}

export default function DashboardClientLayout({ children, user, role }: DashboardClientLayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const pathname = usePathname();

  const links = allLinks.filter(l => l.roles.includes(role as any));

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const userName = `${user.profile?.first_name || ''} ${user.profile?.last_name || ''}`.trim();
  const userInitial = user.profile?.first_name?.[0] || user.email?.[0]?.toUpperCase() || '?';

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-outfit">

      {/* ─── MOBILE DRAWER OVERLAY ─── */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* ─── MOBILE DRAWER ─── */}
      <div className={`
        fixed top-0 left-0 bottom-0 w-[280px] z-[70] lg:hidden
        transition-transform duration-300 ease-in-out
        ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full bg-white shadow-2xl flex flex-col overflow-hidden rounded-r-[2.5rem]">
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <Link href="/" onClick={() => setDrawerOpen(false)}>
              <img src="/logo.webp" alt="Logo" className="h-8 w-auto object-contain" />
            </Link>
            <button
              onClick={() => setDrawerOpen(false)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <X size={18} className="text-slate-500" />
            </button>
          </div>

          {/* Drawer Nav */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
            {links.map(link => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                Icon={link.icon}
                isActive={pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/dashboard')}
                onClick={() => setDrawerOpen(false)}
              />
            ))}
          </div>

          {/* Drawer Footer */}
          <div className="border-t border-slate-100 p-4 space-y-2">
            <Link
              href="/allproduct"
              onClick={() => setDrawerOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
            >
              <Home size={15} />
              Boutique
            </Link>
            <button
              onClick={() => signOut()}
              className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
            >
              <LogOut size={15} />
              Déconnexion
            </button>
          </div>

          {/* User Info at bottom */}
          <div className="px-4 pb-5">
            <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-[#1A2E28] flex items-center justify-center overflow-hidden flex-shrink-0">
                {user.profile?.avatar_url ? (
                  <img src={user.profile.avatar_url} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-black text-[#C9A96E]">{userInitial}</span>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-slate-900 truncate">{userName}</p>
                <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">{role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── DESKTOP SIDEBAR ─── */}
      <aside className="hidden lg:flex w-[280px] flex-shrink-0 flex-col sticky top-0 h-screen p-5 z-20">
        <div className="bg-white border border-slate-100 shadow-sm rounded-[2.5rem] h-full flex flex-col overflow-hidden">
          <div className="px-8 py-6 flex items-center justify-center border-b border-slate-100">
            <Link href="/">
              <img src="/logo.webp" alt="Bazaar Style Logo" className="h-10 w-auto object-contain drop-shadow-sm" />
            </Link>
          </div>

          <div className="flex-1 px-3 py-5 overflow-y-auto space-y-0.5">
            {links.map(link => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                Icon={link.icon}
                isActive={pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/dashboard')}
              />
            ))}
          </div>

          <div className="p-5 border-t border-slate-100">
            <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-[#1A2E28] flex items-center justify-center overflow-hidden flex-shrink-0 border border-slate-200">
                {user.profile?.avatar_url ? (
                  <img src={user.profile.avatar_url} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-black text-[#C9A96E]">{userInitial}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-slate-900 truncate">{userName}</p>
                <p className="text-[9px] font-medium text-slate-400 truncate uppercase tracking-widest">{role}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">

        {/* Global Transparent Overlay for Profile Menu */}
        {isProfileMenuOpen && (
           <div 
             className="fixed inset-0 z-[80]" 
             onClick={() => setIsProfileMenuOpen(false)} 
           />
        )}

        {/* Mobile Top Bar */}
        <header className="lg:hidden sticky top-0 z-[85] h-16 bg-white border-b border-slate-100 shadow-sm flex items-center justify-between px-5">
          <button
            onClick={() => setDrawerOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <Menu size={20} className="text-slate-600" />
          </button>

          <Link href="/">
            <img src="/logo.webp" alt="Logo" className="h-7 w-auto object-contain" />
          </Link>

          <div className="relative">
            <button 
               onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
               className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#1A2E28] overflow-hidden hover:opacity-90 transition-opacity"
            >
              {user.profile?.avatar_url ? (
                <img src={user.profile.avatar_url} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-black text-[#C9A96E]">{userInitial}</span>
              )}
            </button>
            <div className={`absolute top-full right-0 mt-2 w-52 bg-white border border-slate-100 shadow-2xl rounded-2xl p-2 transition-all duration-200 z-[90] ${isProfileMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
              <Link href="/allproduct" className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors">
                <Home size={15} className="text-slate-400" />
                Boutique
              </Link>
              <button
                onClick={() => signOut()}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-rose-500 hover:bg-rose-50 rounded-xl transition-colors mt-1"
              >
                <LogOut size={15} />
                Déconnexion
              </button>
            </div>
          </div>
        </header>

        {/* Desktop Top Bar */}
        <header className="hidden lg:flex items-center justify-end px-6 pt-5 pb-0 shrink-0 relative z-[85]">
          <div className="flex items-center gap-3 relative">
            <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-3 bg-white pl-2 pr-4 py-2 rounded-full border border-slate-200 shadow-sm cursor-pointer hover:border-slate-300 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-full bg-[#1A2E28] overflow-hidden flex items-center justify-center">
                {user.profile?.avatar_url ? (
                  <img src={user.profile.avatar_url} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-black text-[#C9A96E]">{userInitial}</span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900 leading-tight block max-w-[120px] truncate">{userName}</span>
                <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest leading-tight">{role}</span>
              </div>
              <ChevronDown size={14} className={`text-slate-400 transition-transform ${isProfileMenuOpen ? 'rotate-180 text-slate-900' : ''} ml-1`} />
            </button>

            {/* Dropdown */}
            <div className={`absolute top-full right-0 mt-2 w-52 bg-white border border-slate-100 shadow-2xl rounded-2xl p-2 transition-all duration-200 z-[90] ${isProfileMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
              <Link href="/allproduct" className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors">
                <Home size={15} className="text-slate-400" />
                Boutique
              </Link>
              <button
                onClick={() => signOut()}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-rose-500 hover:bg-rose-50 rounded-xl transition-colors mt-1"
              >
                <LogOut size={15} />
                Déconnexion
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto dashboard-content">
          <div className="bg-white border border-slate-100 shadow-sm rounded-[2rem] lg:rounded-[3rem] p-5 lg:p-10 min-h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
