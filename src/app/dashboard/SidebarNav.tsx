"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Role } from "@/lib/types";
import { ShoppingBag, Clock, Package, FolderTree, Users, Settings, LayoutDashboard, MessageSquare, Heart, Home, ArrowLeft, Tag, Ticket } from "lucide-react";

interface NavLink {
  href: string;
  label: string;
  icon: any;
  roles: Role[];
}

const navLinks: NavLink[] = [
  // Admin & Staff Links
  { href: "/dashboard", label: "Tableau de Bord", icon: LayoutDashboard, roles: ['super_admin', 'owner', 'staff'] },
  { href: "/dashboard/orders", label: "Commandes Client", icon: ShoppingBag, roles: ['super_admin', 'owner', 'staff'] },
  { href: "/dashboard/products", label: "Gestion Produits", icon: Package, roles: ['super_admin', 'owner', 'staff'] },
  { href: "/dashboard/categories", label: "Categories", icon: FolderTree, roles: ['super_admin', 'owner'] },
  { href: "/dashboard/offers", label: "Gestion Offres", icon: Tag, roles: ['super_admin', 'owner'] },
  { href: "/dashboard/promo-codes", label: "Codes Promo", icon: Ticket, roles: ['super_admin', 'owner'] },
  { href: "/dashboard/users", label: "Équipe & Clients", icon: Users, roles: ['super_admin', 'owner'] },
  { href: "/dashboard/historique", label: "Historique", icon: Clock, roles: ['super_admin', 'owner', 'staff'] },
  { href: "/dashboard/support", label: "Support Client", icon: MessageSquare, roles: ['super_admin', 'owner', 'staff'] },
  { href: "/dashboard/settings", label: "Paramètres", icon: Settings, roles: ['super_admin', 'owner'] },
  // Client Links
  { href: "/dashboard/client", label: "Profil", icon: Users, roles: ['customer'] },
  { href: "/dashboard/client/favorites", label: "Favoris", icon: Heart, roles: ['customer'] },
  { href: "/dashboard/client/orders", label: "Mes Achats", icon: ShoppingBag, roles: ['customer'] },
  { href: "/dashboard/client/support", label: "Support", icon: MessageSquare, roles: ['customer'] },
];

export default function SidebarNav({ role }: { role: Role }) {
  const pathname = usePathname();

  const filteredLinks = navLinks.filter(link => link.roles.includes(role));

  return (
    <div className="flex flex-col h-full">
      <nav className="flex flex-col gap-1.5 flex-1 w-full pl-2">
        {filteredLinks.map((link) => {
          const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/dashboard');
          const Icon = link.icon;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              prefetch={true}
              className={`
                group relative flex items-center gap-4 px-6 py-4 text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-500 rounded-2xl lg:rounded-l-[1.5rem] lg:rounded-r-none
                ${isActive 
                  ? "text-[#1A2E28] bg-[#C9A96E]/10" 
                  : "text-slate-400 hover:text-[#1A2E28] hover:bg-slate-50"
                }
              `}
            >
              {/* Active Indicator Line */}
              {isActive && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#C9A96E] rounded-l-full shadow-[0_0_15px_rgba(201,169,110,0.5)]" />
              )}
              
              <Icon 
                size={18} 
                className={`transition-all duration-500 ${isActive ? 'text-[#C9A96E] scale-110' : 'text-slate-300 group-hover:text-[#1A2E28]'}`} 
              />
              <span className="flex-1 mt-0.5">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer - Navigation */}
      <div className="pt-6 mt-6 px-1 border-t border-slate-100 flex flex-col gap-2">
        <button 
          onClick={() => window.history.back()}
          className="flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"
        >
          <ArrowLeft size={16} />
          Retour
        </button>
        <Link 
          href="/allproduct"
          className="flex items-center gap-4 px-6 py-4 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 hover:text-[#C9A96E] hover:bg-[#C9A96E]/5 rounded-xl transition-all group"
        >
          <Home size={16} className="group-hover:scale-110 transition-transform" />
          <span>Boutique</span>
        </Link>
      </div>
    </div>
  );
}
