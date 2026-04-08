"use client";
import { useState } from "react";
import { User, Bell, Globe, Shield, Layout, Sliders, Save, AlertCircle, Loader } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import { updateProfileAvatar } from "@/lib/actions/user_actions";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function SettingsClient({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState(user?.profile?.avatar_url || "");

  const handleSave = async () => {
    setSaving(true);
    
    try {
      if (avatarUrl && avatarUrl !== user?.profile?.avatar_url) {
        await updateProfileAvatar(user.id, avatarUrl);
      }
      
      // Simulate other saves
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      router.refresh();
      // Notify other components (like Header) to re-fetch user data
      window.dispatchEvent(new CustomEvent('profileUpdated'));
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "general", label: "Général", icon: Sliders },
    { id: "account", label: "Mon Profil", icon: User },
    { id: "appearance", label: "Apparence", icon: Layout },
    { id: "security", label: "Sécurité", icon: Shield },
    { id: "notifications", label: "Alertes", icon: Bell },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <DashboardHeader 
        title="Paramètres Boutique"
        subtitle="Configuration & Identité de l'Atelier"
        badge="Configuration"
        icon={Sliders}
        action={
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-3 px-8 py-4 btn-premium rounded-2xl shadow-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-60"
          >
             {saving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
             {success ? "✓ Enregistré !" : "Sauvegarder"}
          </button>
        }
      />

      <div className="flex flex-col md:flex-row gap-8">
         {/* Sidebar Navigation */}
         <aside className="w-full md:w-56 shrink-0">
            <nav className="flex flex-col gap-1">
               {tabs.map((tab) => (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all text-left ${
                     activeTab === tab.id
                       ? "bg-[#1A2E28] text-[#F2EBE1] border border-[#F2EBE1]/10 shadow-xl"
                       : "text-slate-400 hover:text-[#1A2E28] hover:bg-white border border-transparent"
                   }`}
                 >
                    <tab.icon size={15} strokeWidth={activeTab === tab.id ? 2.5 : 1.5} />
                    {tab.label}
                 </button>
               ))}
            </nav>
         </aside>

         {/* Content */}
         <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10">
            {activeTab === 'general' && (
               <div className="space-y-8">
                  <div className="pb-6 border-b border-slate-100">
                     <h3 className="text-xl font-black text-slate-900 mb-1">Identité de la Boutique</h3>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Paramètres d'affichage public.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Nom de la Boutique</label>
                        <input type="text" defaultValue="Bazaar Style" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:border-blue-300 transition-all font-medium text-slate-900" />
                     </div>
                     <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Email de Support</label>
                        <input type="email" defaultValue="support@bazaarstyle.ma" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:border-blue-300 transition-all font-medium text-slate-900" />
                     </div>
                  </div>

                  <div>
                     <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Slogan</label>
                     <textarea rows={2} defaultValue="Beauté authentique du Maroc." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:border-blue-300 transition-all font-medium resize-none text-slate-900" />
                  </div>

                  <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500">
                           <Globe size={18} />
                        </div>
                        <div>
                           <p className="text-sm font-bold text-slate-900">Mode Maintenance</p>
                           <p className="text-[10px] text-slate-400 font-medium">Masquer la boutique pendant les mises à jour.</p>
                        </div>
                     </div>
                     <div className="relative inline-flex items-center h-5 w-9 rounded-full bg-slate-300 cursor-pointer">
                        <div className="absolute left-1 bg-white w-3 h-3 rounded-full shadow-sm" />
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'account' && (
               <div className="space-y-8">
                  <div className="pb-6 border-b border-slate-100">
                     <h3 className="text-xl font-black text-slate-900 mb-1">Mon Profil</h3>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gérez votre identité personnelle.</p>
                  </div>

                  <div className="flex flex-col items-center gap-4 py-4">
                     <div className="w-48">
                        <ImageUpload 
                           label="Photo de profil"
                           currentImageUrl={avatarUrl}
                           onUpload={(url) => {
                               setAvatarUrl(url);
                           }}
                        />
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Prénom</label>
                        <input type="text" defaultValue={user?.profile?.first_name} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:border-blue-300 transition-all font-medium text-slate-900" />
                     </div>
                     <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Nom</label>
                        <input type="text" defaultValue={user?.profile?.last_name} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:border-blue-300 transition-all font-medium text-slate-900" />
                     </div>
                  </div>
               </div>
            )}

            {activeTab !== 'general' && activeTab !== 'account' && (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                 <AlertCircle size={40} strokeWidth={1} className="text-slate-200" />
                 <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Module en cours de développement</p>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
