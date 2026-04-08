"use client";
import React, { useEffect, useState } from 'react';
import { getUser } from '@/lib/actions/auth';
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Camera,
  Check,
  Loader2
} from 'lucide-react';
import { createClient } from '@/lib/supabase';

export default function UserProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      const u = await getUser();
      if (u) {
        setUser(u);
        setProfile({
          first_name: u.profile?.first_name || "",
          last_name: u.profile?.last_name || "",
          email: u.email || "",
          phone: u.profile?.phone || "",
        });
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    
    const supabase = createClient();
    const { error } = await (supabase.from("profiles") as any)
      .update({
        first_name: profile.first_name,
        last_name: profile.last_name,
      })
      .eq("id", user.id);

    if (!error) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-pink-100 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-up max-w-2xl">
      <div className="mb-12">
        <h1 className="text-5xl font-black text-foreground tracking-tighter uppercase leading-none mb-4">
          Identité <span className="text-primary italic lowercase">Sacre</span>
        </h1>
        <p className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.4em]">Gérez vos informations personnelles.</p>
      </div>

      <div className="glass-card rounded-[4rem] border border-white/50 p-12 shadow-2xl shadow-pink-200/20">
        <div className="flex items-center gap-8 mb-16">
          <div className="relative group">
            <div className="w-24 h-24 rounded-[2.5rem] bg-pink-50 border-2 border-white shadow-xl flex items-center justify-center overflow-hidden">
               <User size={40} className="text-primary/20" />
            </div>
            <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white shadow-lg rounded-2xl flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
              <Camera size={18} />
            </button>
          </div>
          <div>
            <h3 className="text-xl font-black text-foreground tracking-tight">{profile.first_name} {profile.last_name}</h3>
            <p className="text-[9px] font-black text-primary uppercase tracking-widest mt-1">Niveau Signature • Client Privé</p>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-foreground/30 uppercase tracking-widest ml-4">Prénom</label>
              <div className="relative">
                <input
                  required
                  value={profile.first_name}
                  onChange={e => setProfile(p => ({ ...p, first_name: e.target.value }))}
                  className="w-full bg-pink-50/30 border border-white rounded-[2rem] py-5 px-8 text-[13px] focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-foreground"
                />
                <User size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-primary/20" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-foreground/30 uppercase tracking-widest ml-4">Nom</label>
              <div className="relative">
                <input
                  required
                  value={profile.last_name}
                  onChange={e => setProfile(p => ({ ...p, last_name: e.target.value }))}
                  className="w-full bg-pink-50/30 border border-white rounded-[2rem] py-5 px-8 text-[13px] focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-foreground"
                />
                <Shield size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-primary/20" />
              </div>
            </div>
          </div>

          <div className="space-y-3 opacity-50 cursor-not-allowed">
            <label className="block text-[10px] font-black text-foreground/30 uppercase tracking-widest ml-4">Email (Non modifiable)</label>
            <div className="relative">
              <input
                disabled
                value={profile.email}
                className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] py-5 px-8 text-[13px] font-bold text-foreground/40"
              />
              <Mail size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300" />
            </div>
          </div>

          <div className="pt-8">
            <button
              type="submit"
              disabled={saving}
              className="btn-premium !w-full !py-6 flex items-center justify-center gap-4 shadow-xl shadow-pink-200"
            >
              {saving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Mise à jour en cours...
                </>
              ) : success ? (
                <>
                  <Check size={18} />
                  Profil Mis à Jour
                </>
              ) : (
                "Sauvegarder les Changements"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
