"use client";
import React, { useState, useEffect, useRef } from 'react';
import { db } from '@/lib/firebase/config';
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp,
} from 'firebase/firestore';
import {
  Plus, Trash2, ToggleLeft, ToggleRight, ImagePlus, Tag, Loader2, AlertCircle, Gift, BadgePercent, X, ChevronDown
} from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import CustomSelect from '@/components/ui/CustomSelect';

interface Offer {
  id: string;
  title: string;
  description: string;
  badge: string;         // e.g. "GRATUIT" | "-20%" | "PROMO"
  price: string;         // e.g. "0 DH" | "-20%" | "500 DH"
  imageUrl: string;
  link: string;          // Redirection URL
  active: boolean;
  type: 'pack' | 'global_promo' | 'specific_promo' | 'product_addon';
  product_id?: string;   // For specific_promo or product_addon
  product_ids?: string[]; // For packs
  createdAt?: any;
}

const BADGE_OPTIONS = [
  { label: 'Gratuit', value: 'GRATUIT', color: '#16a34a' },
  { label: 'Promotion', value: 'PROMO', color: '#C9A96E' },
  { label: 'Exclusif', value: 'EXCLUSIF', color: '#1A1A1A' },
  { label: 'Nouveau', value: 'NOUVEAU', color: '#7c3aed' },
  { label: 'Livraison offerte', value: 'LIVRAISON', color: '#0ea5e9' },
];

const OFFER_TYPES = [
  { label: 'Pack de Produits', value: 'pack' },
  { label: 'Promotion Globale (Tous)', value: 'global_promo' },
  { label: 'Promotion Produit Spécifique', value: 'specific_promo' },
  { label: 'Cadeau / Ajout Produit', value: 'product_addon' },
];

const EMPTY_FORM = { 
  title: '', 
  description: '', 
  badge: 'PROMO', 
  price: '', 
  imageUrl: '', 
  link: '', 
  type: 'global_promo' as 'pack' | 'global_promo' | 'specific_promo' | 'product_addon',
  product_id: '',
  product_ids: [] as string[]
};

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Live Firestore listener + Products fetch
  useEffect(() => {
    // Fetch Products for selector
    onSnapshot(collection(db, 'products'), (snap) => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const q = query(collection(db, 'offers'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setOffers(snap.docs.map(d => ({ id: d.id, ...d.data() } as Offer)));
      setLoading(false);
    }, (err) => {
      setError('Erreur Firestore : ' + err.message);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        // Update existing
        await updateDoc(doc(db, 'offers', editingId), {
          ...form,
        });
      } else {
        // Create new
        await addDoc(collection(db, 'offers'), {
          ...form,
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

  const handleEdit = (offer: Offer) => {
    setForm({
      title: offer.title,
      description: offer.description,
      badge: offer.badge,
      price: offer.price,
      imageUrl: offer.imageUrl,
      link: offer.link || '',
      type: offer.type as any || 'global_promo',
      product_id: offer.product_id || '',
      product_ids: offer.product_ids || [],
    });
    setEditingId(offer.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggle = async (offer: Offer) => {
    await updateDoc(doc(db, 'offers', offer.id), { active: !offer.active });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette offre ?')) return;
    await deleteDoc(doc(db, 'offers', id));
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
            Gestion des <span className="text-primary italic lowercase">Offres</span>
          </h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.4em] mt-2">
            Packs, Promotions et Ventes Flash
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
          {showForm ? 'Annuler' : 'Nouvelle Offre'}
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold">{error}</p>
            <p className="text-[10px] mt-1 text-rose-500">→ Vérifiez vos règles de sécurité Firestore.</p>
          </div>
        </div>
      )}

      {/* Create/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 border-b border-slate-50 pb-4">
            {editingId ? 'Modifier l\'offre' : 'Configuration de l\'offre'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Type d'offre */}
             <div className="space-y-3 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Type d'offre</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {OFFER_TYPES.map(type => (
                  <button
                    key={type.value}
                    onClick={() => setForm(f => ({ ...f, type: type.value as any }))}
                    className={`px-4 py-4 rounded-2xl border-2 text-[10px] font-black uppercase tracking-widest transition-all text-center ${
                      form.type === type.value 
                        ? 'border-slate-900 bg-slate-900 text-white shadow-lg' 
                        : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Selector for Specific Promo or Add-on */}
            {(form.type === 'specific_promo' || form.type === 'product_addon') && (
                <CustomSelect
                  label="Sélectionner le produit"
                  options={products.map(p => ({ id: p.id, name: `${p.title} (${p.price} DH)` }))}
                  value={form.product_id}
                  onChange={(val) => setForm(f => ({ ...f, product_id: val || "" }))}
                  placeholder="Choisir un produit..."
                  className="w-full"
                />
            )}

            {/* Product Multi-selector for Packs */}
            {form.type === 'pack' && (
              <div className="space-y-3 md:col-span-2 animate-in fade-in slide-in-from-left-4 duration-300">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Produits du pack</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto p-4 bg-slate-50 rounded-2xl border border-slate-200 custom-scrollbar">
                  {products.map(p => {
                    const isSelected = form.product_ids.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          const newIds = isSelected 
                            ? form.product_ids.filter(id => id !== p.id)
                            : [...form.product_ids, p.id];
                          setForm(f => ({ ...f, product_ids: newIds }));
                        }}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                          isSelected ? 'bg-white border-slate-900 shadow-sm' : 'bg-transparent border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-slate-900 border-slate-900' : 'border-slate-200'}`}>
                           {isSelected && <Plus size={10} className="text-white rotate-45" />}
                        </div>
                        <span className="text-[10px] font-bold text-slate-700 truncate">{p.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            {/* Image Upload */}
            <div className="md:col-span-2">
              <ImageUpload
                label="Image de l'offre"
                currentImageUrl={form.imageUrl}
                onUpload={(url) => setForm(f => ({ ...f, imageUrl: url }))}
              />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Titre de l'offre *</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Ex : Shampoing Purifiant Premium"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-primary transition-all"
              />
            </div>

            {/* Price / Value */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Prix / Valeur</label>
              <input
                type="text"
                value={form.price}
                onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                placeholder="Ex : -20%, GRATUIT, 180 DH..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-primary transition-all"
              />
            </div>

            {/* Link URL */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Lien de redirection (Optionnel)</label>
              <input
                type="text"
                value={form.link}
                onChange={e => setForm(f => ({ ...f, link: e.target.value }))}
                placeholder="Ex: /products?category=shampoing"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-primary transition-all"
              />
            </div>

            {/* Description */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Ex : Livraison offerte dès 500 DH d'achat. Valable jusqu'au 31 Mars."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-primary transition-all resize-none h-20"
              />
            </div>

            {/* Badge */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Badge</label>
              <div className="flex flex-wrap gap-2">
                {BADGE_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setForm(f => ({ ...f, badge: opt.value }))}
                    className="px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-full border transition-all"
                    style={{
                      borderColor: opt.color,
                      backgroundColor: form.badge === opt.value ? opt.color : 'transparent',
                      color: form.badge === opt.value ? '#fff' : opt.color,
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview Card */}
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Aperçu</p>
            <OfferCard offer={{ id: '__preview', ...form, active: true }} preview />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!form.title.trim() || saving}
            className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-all disabled:opacity-40"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : (editingId ? <Tag size={14} /> : <Plus size={14} />)}
            {editingId ? 'Mettre à jour l\'offre' : 'Ajouter l\'offre'}
          </button>
        </div>
      )}

      {/* Offer List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-7 h-7 border-2 border-slate-200 border-t-primary rounded-full animate-spin" />
        </div>
      ) : offers.length === 0 ? (
        <div className="text-center py-20 text-slate-300">
          <Gift size={48} className="mx-auto mb-4" />
          <p className="text-xs font-bold uppercase tracking-widest">Aucune offre créée</p>
        </div>
      ) : (
        <div className="space-y-4">
          {offers.map(offer => (
            <div key={offer.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 flex gap-6 items-start flex-wrap md:flex-nowrap">
              {/* Preview */}
              <div className="w-full md:w-64 shrink-0">
                <OfferCard offer={offer} />
              </div>

              {/* Controls */}
              <div className="flex-1 flex flex-col justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-base font-bold text-slate-900">{offer.title}</p>
                  {offer.price && <p className="text-sm font-black text-primary">{offer.price}</p>}
                  {offer.description && <p className="text-xs text-slate-500 leading-relaxed">{offer.description}</p>}
                  {offer.link && <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Lien: {offer.link}</p>}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Edit */}
                  <button
                    onClick={() => handleEdit(offer)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 text-slate-600 border border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all"
                  >
                    <ImagePlus size={12} /> Modifier
                  </button>

                  {/* Toggle */}
                  <button
                    onClick={() => handleToggle(offer)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                      offer.active
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}
                  >
                    {offer.active
                      ? <><ToggleRight size={14} /> Active</>
                      : <><ToggleLeft size={14} /> Désactivée</>}
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(offer.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 text-rose-500 border border-rose-200 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
                  >
                    <Trash2 size={12} /> Supprimer
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

/* ── Mini Offer Card Component ── */
function OfferCard({ offer, preview = false }: { offer: Omit<Offer, 'createdAt'>; preview?: boolean }) {
  const badgeColor = BADGE_OPTIONS.find(b => b.value === offer.badge)?.color ?? '#C9A96E';
  return (
    <div
      className="relative overflow-hidden flex flex-col justify-between"
      style={{
        borderRadius: '16px',
        background: offer.imageUrl ? 'transparent' : `linear-gradient(135deg, ${badgeColor}18, ${badgeColor}08)`,
        border: `1px solid ${badgeColor}30`,
        minHeight: '140px',
        opacity: preview ? 1 : offer.active ? 1 : 0.5,
      }}
    >
      {offer.imageUrl && (
        <img
          src={offer.imageUrl}
          alt={offer.title}
          className="absolute inset-0 w-full h-full object-cover"
          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      )}
      {/* Overlay */}
      {offer.imageUrl && <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 40%, transparent)' }} />}

      <div className="relative z-10 p-4 mt-auto">
        {/* Badge */}
        <span className="inline-block px-2.5 py-1 text-[8px] font-black tracking-[0.2em] uppercase text-white rounded mb-2" style={{ backgroundColor: badgeColor }}>
          {offer.badge}
        </span>
        <p className="font-bold text-sm leading-tight" style={{ color: offer.imageUrl ? '#fff' : '#1A1A1A' }}>
          {offer.title || <span className="text-slate-400 font-normal italic">Titre de l'offre</span>}
        </p>
        {offer.price && (
          <p className="text-base font-black mt-1" style={{ color: offer.imageUrl ? '#fff' : badgeColor }}>
            {offer.price}
          </p>
        )}
      </div>
    </div>
  );
}
