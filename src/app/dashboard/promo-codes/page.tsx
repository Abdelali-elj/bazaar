"use client";
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/config';
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp,
} from 'firebase/firestore';
import {
  Plus, Trash2, ToggleLeft, ToggleRight, Tag, Loader2, AlertCircle, Ticket, X
} from 'lucide-react';

interface PromoCode {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  active: boolean;
  usageLimit?: number;
  timesUsed?: number;
  productIds?: string[];
  createdAt?: any;
}

const EMPTY_FORM = { 
  code: '', 
  discountType: 'percentage' as 'percentage' | 'fixed', 
  discountValue: 0,
  usageLimit: 0,
  productIds: [] as string[],
};

export default function AdminPromoCodesPage() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    // Fetch products for selection
    const qProducts = query(collection(db, 'products'), orderBy('title', 'asc'));
    const unsubProducts = onSnapshot(qProducts, (snap) => {
        setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const qCats = query(collection(db, 'categories'), orderBy('name', 'asc'));
    const unsubCats = onSnapshot(qCats, (snap) => {
        setCategories(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const q = query(collection(db, 'promo_codes'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setPromoCodes(snap.docs.map(d => ({ id: d.id, ...d.data() } as PromoCode)));
      setLoading(false);
    }, (err) => {
      setError('Erreur Firestore : ' + err.message);
      setLoading(false);
    });
    return () => {
        unsub();
        unsubProducts();
        unsubCats();
    };
  }, []);

  const handleSubmit = async () => {
    if (!form.code.trim() || form.discountValue <= 0) return;
    setSaving(true);
    try {
      const payload = {
          code: form.code.trim().toUpperCase(),
          discountType: form.discountType,
          discountValue: Number(form.discountValue),
          usageLimit: form.usageLimit > 0 ? Number(form.usageLimit) : null,
          productIds: form.productIds.length > 0 ? form.productIds : null,
      };

      if (editingId) {
        await updateDoc(doc(db, 'promo_codes', editingId), payload);
      } else {
        await addDoc(collection(db, 'promo_codes'), {
          ...payload,
          active: true,
          createdAt: serverTimestamp(),
        });
      }
      setForm(EMPTY_FORM);
      setShowForm(false);
      setEditingId(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (pc: PromoCode) => {
    setForm({
      code: pc.code,
      discountType: pc.discountType,
      discountValue: pc.discountValue,
      usageLimit: pc.usageLimit || 0,
      productIds: pc.productIds || [],
    });
    setEditingId(pc.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggle = async (pc: PromoCode) => {
    await updateDoc(doc(db, 'promo_codes', pc.id), { active: !pc.active });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce code promo ?')) return;
    await deleteDoc(doc(db, 'promo_codes', id));
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
            Codes <span className="text-primary italic lowercase">Promo</span>
          </h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.4em] mt-2">
            Réductions applicables au panier
          </p>
        </div>
        <button
          onClick={() => {
            if (showForm) {
              setForm(EMPTY_FORM);
              setEditingId(null);
            }
            setShowForm(v => !v);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-all"
        >
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? 'Annuler' : 'Nouveau Code'}
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold">{error}</p>
          </div>
        </div>
      )}

      {/* Create/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 border-b border-slate-50 pb-4">
            {editingId ? 'Modifier le code' : 'Configuration du code promo'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Type de réduction */}
             <div className="space-y-3 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Type de réduction</label>
              <div className="grid grid-cols-2 gap-3 max-w-sm">
                {[
                  { label: 'Pourcentage (%)', value: 'percentage' },
                  { label: 'Montant Fixe (DH)', value: 'fixed' },
                ].map(type => (
                  <button
                    key={type.value}
                    onClick={() => setForm(f => ({ ...f, discountType: type.value as any }))}
                    className={`px-4 py-4 rounded-2xl border-2 text-[10px] font-black uppercase tracking-widest transition-all text-center ${
                      form.discountType === type.value 
                        ? 'border-slate-900 bg-slate-900 text-white shadow-lg' 
                        : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Code (ex: WELCOME20) *</label>
              <input
                type="text"
                value={form.code}
                onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase().replace(/\s/g, '') }))}
                placeholder="Ex : WELCOME20"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-primary transition-all font-mono tracking-widest uppercase"
              />
            </div>

            {/* Value */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Valeur ({form.discountType === 'percentage' ? '%' : 'DH'}) *
              </label>
              <input
                type="number"
                min="1"
                value={form.discountValue || ''}
                onChange={e => setForm(f => ({ ...f, discountValue: Number(e.target.value) }))}
                placeholder={form.discountType === 'percentage' ? "Ex : 20" : "Ex : 150"}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-primary transition-all"
              />
            </div>

            {/* Usage Limit */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Limite d'utilisation (Optionnel)
              </label>
              <input
                type="number"
                
                min="0"
                value={form.usageLimit || ''}
                onChange={e => setForm(f => ({ ...f, usageLimit: Number(e.target.value) }))}
                placeholder="Ex : 50 (0 pour illimité)"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-primary transition-all"
              />
            </div>

            {/* Product Selection */}
            <div className="space-y-4 md:col-span-2 border-t border-slate-50 pt-8">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Produits éligibles (Optionnel)</label>
                  <p className="text-[9px] text-slate-400 mt-1 italic">Laissez vide pour appliquer à tous les produits.</p>
                </div>
                
                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("")}
                    className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                      selectedCategory === "" ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'bg-slate-50 text-slate-400 border border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    Tous
                  </button>
                  {categories.filter(c => c.name).map(cat => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                        selectedCategory === cat.id ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'bg-slate-50 text-slate-400 border border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar p-1">
                {products
                  .filter(p => !selectedCategory || p.category_id === selectedCategory)
                  .map(p => {
                    const isSelected = form.productIds.includes(p.id);
                    return (
                        <button
                            type="button"
                            key={p.id}
                            onClick={() => {
                                setForm(f => ({
                                    ...f,
                                    productIds: isSelected 
                                        ? f.productIds.filter(id => id !== p.id)
                                        : [...f.productIds, p.id]
                                }));
                            }}
                            className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all group ${
                                isSelected 
                                    ? 'border-slate-900 bg-slate-900/5 text-slate-900 shadow-sm' 
                                    : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200'
                            }`}
                        >
                            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                              <img 
                                src={p.images?.[0] || 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=300'} 
                                className="w-full h-full object-cover" 
                                alt="" 
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className={`text-[10px] font-black truncate uppercase tracking-tight ${isSelected ? 'text-slate-900' : 'text-slate-900'}`}>{p.title}</p>
                                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                                  {isSelected ? 'Sélectionné' : `${p.price} DH`}
                                </p>
                            </div>

                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${isSelected ? 'bg-slate-900 border-slate-900 scale-110 shadow-lg shadow-slate-900/20' : 'bg-white border-slate-200 group-hover:border-slate-400'}`}>
                                {isSelected && <div className="w-2 h-0.5 bg-white rotate-45 translate-x-[1px] translate-y-0.5" />}
                                {isSelected && <div className="w-1 h-0.5 bg-white -rotate-45 -translate-x-1" />}
                            </div>
                        </button>
                    );
                })}
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!form.code.trim() || form.discountValue <= 0 || saving}
            className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-all disabled:opacity-40"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            {editingId ? 'Mettre à jour' : 'Créer le code'}
          </button>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-7 h-7 border-2 border-slate-200 border-t-primary rounded-full animate-spin" />
        </div>
      ) : promoCodes.length === 0 ? (
        <div className="text-center py-20 text-slate-300">
          <Ticket size={48} className="mx-auto mb-4" />
          <p className="text-xs font-bold uppercase tracking-widest">Aucun code promo créé</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {promoCodes.map(pc => (
            <div key={pc.id} className={`bg-white rounded-[2rem] border ${pc.active ? 'border-primary/20 bg-primary/5' : 'border-slate-100'} shadow-sm p-6 flex flex-col gap-4 relative overflow-hidden group`}>
               {/* Background Watermark */}
               <Ticket className="absolute -bottom-8 -right-8 w-32 h-32 opacity-5 text-slate-900 pointer-events-none" />
               
               <div className="flex justify-between items-start z-10">
                 <div className="bg-slate-900 text-white px-3 py-1.5 rounded-lg font-mono tracking-widest font-black text-lg">
                    {pc.code}
                 </div>
                 {pc.active && (
                   <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-widest border border-emerald-100">
                     Actif
                   </span>
                 )}
               </div>

               <div className="flex flex-col z-10">
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Réduction de</span>
                  <span className="text-3xl font-black text-slate-900">
                    {pc.discountType === 'percentage' ? `${pc.discountValue}%` : `${pc.discountValue} DH`}
                  </span>
                </div>

                <div className="flex flex-col gap-1 z-10 mt-auto pt-2">
                  {pc.usageLimit && (
                    <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-slate-400">
                      <span>Utilisation</span>
                      <span>{pc.timesUsed || 0} / {pc.usageLimit}</span>
                    </div>
                  )}
                  {pc.productIds && pc.productIds.length > 0 && (
                    <div className="text-[9px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded w-fit mt-1">
                      {pc.productIds.length} produits spécifiques
                    </div>
                  )}
                </div>

               {/* Actions */}
               <div className="flex items-center justify-between gap-2 mt-4 pt-4 border-t border-slate-100/50 z-10">
                  {/* Edit */}
                  <button
                    onClick={() => handleEdit(pc)}
                    className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
                  >
                    <Tag size={16} />
                  </button>

                  <div className="flex items-center gap-2">
                    {/* Toggle */}
                    <button
                      onClick={() => handleToggle(pc)}
                      className={`p-2 transition-all rounded-full ${pc.active ? 'text-emerald-500 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-50'}`}
                    >
                      {pc.active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(pc.id)}
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
