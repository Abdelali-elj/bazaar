"use client";
import { useState, useEffect } from "react";
import { Search, Shield, ShieldCheck, ShieldAlert, User, ChevronDown, Check, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import CustomSelect from "@/components/ui/CustomSelect";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function UsersClient({ initialProfiles }: { initialProfiles: any[] }) {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [search, setSearch] = useState("");
  const [loadingRole, setLoadingRole] = useState<{id: string, role: string} | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const router = useRouter();

  // Sync local state when server component updates the props after a router.refresh()
  useEffect(() => {
    setProfiles(initialProfiles);
  }, [initialProfiles]);

  const filtered = profiles.filter(p =>
    `${p.first_name} ${p.last_name} ${p.email ?? ""}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleRoleChange = async (id: string, newRole: string) => {
    setLoading(id);
    try {
      const res = await fetch("/api/users/update-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id, role: newRole }),
      });
      if (res.ok) {
        setProfiles(prev => prev.map(p => p.id === id ? { ...p, role: newRole } : p));
        setSaved(id);
        setTimeout(() => setSaved(null), 2000);
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to update role:", err);
    }
    setLoading(null);
  };

  const getRoleConfig = (role: string) => {
    switch(role) {
      case 'super_admin': return { label: 'Super Admin', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', icon: <ShieldAlert size={13} /> };
      case 'owner':       return { label: 'Gérant', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', icon: <ShieldCheck size={13} /> };
      case 'staff':       return { label: 'Staff', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: <Shield size={13} /> };
      default:            return { label: 'Client', color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200', icon: <User size={13} /> };
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      <DashboardHeader 
        title="Cercles Privés"
        subtitle="Gestion des Membres & Rôles"
        badge="Communauté"
        icon={User}
        action={
          <div className="flex items-center gap-4 px-6 py-4 bg-white border border-[#F2EBE1] rounded-[2.5rem] shadow-sm">
            <div className="flex -space-x-3">
               {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full bg-pink-50 border-2 border-white shadow-sm" />)}
            </div>
            <span className="text-[10px] font-black text-[#1A2E28] uppercase tracking-widest">{profiles.length} Membres Actifs</span>
          </div>
        }
      />

      <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden">
        {/* Table header */}
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-6 px-10">
          <div className="relative w-full sm:w-80 group">
            <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un membre..."
              className="w-full bg-white border border-rose-100/50 rounded-2xl py-3.5 pl-12 pr-6 text-sm font-medium focus:outline-none focus:border-primary/30 transition-all text-slate-900 placeholder:text-slate-300 shadow-sm"
            />
          </div>
          <div className="flex -space-x-2">
            {profiles.slice(0, 6).map((p, i) => (
              <div key={i} className="w-9 h-9 rounded-full border-2 border-white bg-slate-100 shadow-sm overflow-hidden flex items-center justify-center text-[11px] font-black text-slate-500">
                 {p.avatar_url ? <img src={p.avatar_url} className="w-full h-full object-cover" /> : (p.first_name?.[0] ?? "?")}
              </div>
            ))}
            {profiles.length > 6 && (
              <div className="w-9 h-9 rounded-full border-2 border-white bg-blue-50 flex items-center justify-center text-[9px] font-black text-blue-600 shadow-sm">
                +{profiles.length - 6}
              </div>
            )}
          </div>
        </div>

        <div className="hidden md:block overflow-x-auto custom-scrollbar">
          {filtered.length === 0 ? (
            <div className="py-32 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100">
                <User size={32} className="text-slate-300" />
              </div>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.5em]">Aucun utilisateur trouvé.</p>
            </div>
          ) : (
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="bg-white text-[10px] uppercase font-bold text-slate-400 tracking-[0.3em] border-b border-slate-100">
                  <th className="px-10 py-6">Utilisateur</th>
                  <th className="px-8 py-6 text-center">Rôle actuel</th>
                  <th className="px-8 py-6 text-center">Statut</th>
                  <th className="px-8 py-6 text-right">Modifier le rôle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((p) => {
                  const config = getRoleConfig(p.role);
                  return (
                    <tr key={p.id} className="hover:bg-pink-50/30 transition-all duration-200 group/row">
                      <td className="px-10 py-6">
                         <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-rose-100 flex items-center justify-center overflow-hidden shrink-0 text-primary font-black text-lg group-hover/row:border-primary/20 transition-colors">
                               {p.avatar_url ? (
                                 <img src={p.avatar_url} className="w-full h-full object-cover" />
                               ) : (
                                 <span>{p.first_name?.[0]?.toUpperCase() ?? "?"}</span>
                               )}
                            </div>
                            <div>
                               <div className="text-sm text-slate-900 font-bold group-hover/row:text-primary transition-colors">{p.first_name} {p.last_name || ""}</div>
                               <div className="text-[10px] text-slate-500 font-bold lowercase tracking-wider">{p.email}</div>
                               <div className="text-[9px] text-slate-400 font-medium mt-1">
                                 Rejoint le {new Date(p.created_at || Date.now()).toLocaleDateString("fr-FR")}
                                 <span className="ml-2 text-slate-300">•</span>
                                 <span className="ml-2 font-mono text-[8px] text-slate-300">#{p.id.slice(0, 8)}</span>
                               </div>
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                         <div className="flex justify-center">
                           <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-wider ${config.color} ${config.bg} ${config.border}`}>
                             {config.icon}
                             {config.label}
                           </span>
                         </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                         <div className="flex justify-center">
                           <div className="flex items-center gap-2 text-emerald-600 text-[9px] font-bold uppercase tracking-widest">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                             Actif
                           </div>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex justify-end items-center gap-3">
                           {saved === p.id && (
                             <div className="flex items-center gap-1.5 text-emerald-600 text-[9px] font-black uppercase tracking-widest">
                               <Check size={12} />
                               Enregistré
                             </div>
                           )}
                           <CustomSelect
                               options={[
                                   { id: "customer", name: "Client" },
                                   { id: "staff", name: "Staff" },
                                   { id: "owner", name: "Gérant" },
                                   { id: "super_admin", name: "Super Admin" },
                               ]}
                               value={p.role}
                               onChange={(val) => handleRoleChange(p.id, val || "customer")}
                               placeholder="Rôle"
                               className="min-w-[150px]"
                           />
                         </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Mobile View: Cards matching Orders style */}
        <div className="md:hidden p-5 flex flex-col gap-4 bg-slate-50/50">
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100 shadow-sm">
                <User size={24} className="text-slate-300" />
              </div>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.4em]">Aucun membre</p>
            </div>
          ) : (
            filtered.map(p => {
              const config = getRoleConfig(p.role);
              return (
                <div key={p.id} className="bg-white p-5 rounded-[2rem] border border-rose-100 shadow-sm flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-rose-100 flex items-center justify-center overflow-hidden shrink-0 text-primary font-black text-lg">
                      {p.avatar_url ? (
                        <img src={p.avatar_url} className="w-full h-full object-cover" />
                      ) : (
                        <span>{p.first_name?.[0]?.toUpperCase() ?? "?"}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{p.first_name} {p.last_name || ""}</p>
                      <div className={`mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-[8px] font-black uppercase tracking-wider ${config.color} ${config.bg} ${config.border}`}>
                        {config.icon}
                        {config.label}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedUser(p)}
                    className="shrink-0 px-4 py-2.5 bg-pink-50 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm"
                  >
                    Gérer
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* User Management Modal for Mobile */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 md:hidden" onClick={() => setSelectedUser(null)}>
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>
             <div className="p-8 pb-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-lg font-black text-slate-900">Gérer l'accès</h3>
                <div className="flex items-center gap-2 text-emerald-600 text-[9px] font-black uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-lg">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Actif
                </div>
             </div>
             <div className="p-8 space-y-8">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-pink-50 border border-rose-100 flex items-center justify-center overflow-hidden shrink-0 text-primary font-black text-2xl shadow-inner">
                    {selectedUser.avatar_url ? (
                      <img src={selectedUser.avatar_url} className="w-full h-full object-cover" />
                    ) : (
                      <span>{selectedUser.first_name?.[0]?.toUpperCase() ?? "?"}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg font-black text-slate-900 truncate">{selectedUser.first_name} {selectedUser.last_name}</p>
                    <p className="text-[10px] text-slate-400 font-bold tracking-wider truncate">{selectedUser.email}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Attribution du Rôle</label>
                  <CustomSelect
                    options={[
                      { id: "customer", name: "Client (Accès Standard)" },
                      { id: "staff", name: "Staff (Gestion Commandes)" },
                      { id: "owner", name: "Gérant (Gestion Boutique)" },
                      { id: "super_admin", name: "Super Admin (Accès Total)" },
                    ]}
                    value={selectedUser.role}
                    onChange={(val) => {
                      handleRoleChange(selectedUser.id, val || "customer");
                      setSelectedUser({ ...selectedUser, role: val || "customer" });
                    }}
                    placeholder="Rôle"
                    className="w-full"
                  />
                </div>

                <button 
                  onClick={() => setSelectedUser(null)}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-black/10"
                >
                  Fermer
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
