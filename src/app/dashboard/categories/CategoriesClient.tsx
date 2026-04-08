"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/lib/types";
import { Plus, X, Pencil, Trash, Tag, Image as ImageIcon, Layers, Hash } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

interface Props { categories: Category[]; }

export default function CategoriesClient({ categories: initial }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "", image_url: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const slug = form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const payload = { name: form.name, slug, description: form.description || null, image_url: form.image_url || null };
    
    const endpoint = editingId ? "/api/categories/update" : "/api/categories/create";
    const body = editingId ? { id: editingId, ...payload } : payload;
    
    await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    
    setLoading(false); setShowForm(false); setEditingId(null);
    setForm({ name: "", description: "", image_url: "" });
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette catégorie ?")) return;
    await fetch("/api/categories/delete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    router.refresh();
  };

  const handleEdit = (c: Category) => {
    setEditingId(c.id);
    setForm({ name: c.name, description: c.description ?? "", image_url: c.image_url ?? "" });
    setShowForm(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">
             Segments <span className="text-primary italic lowercase">Atelier</span>
          </h1>
          <p className="text-primary/40 text-[10px] font-black uppercase tracking-[0.4em] mt-3">{initial.length} Univers de Beauté Actifs</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ name: "", description: "", image_url: "" }); }}
          className={`px-10 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-4 shadow-2xl ${showForm ? 'bg-white text-slate-900 border border-slate-100 hover:text-slate-900 shadow-slate-200/20' : 'btn-premium'}`}
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Fermer le Segment" : "Nouvel Univers"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/20 p-8 animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-4 mb-8">
             <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-primary">
               {editingId ? <Pencil size={18} /> : <Layers size={18} />}
             </div>
             <div>
                <h2 className="text-lg font-black text-slate-900">{editingId ? "Édition de l'Univers" : "Nouveau Segment"}</h2>
                <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Architecture Branding & Visuels</p>
             </div>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Nom de la Catégorie</label>
              <input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
                placeholder="Ex: Soins Capillaires"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-slate-900 font-medium"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Description Stratégique</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Décrivez les produits inclus dans cette catégorie..."
                rows={2}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-slate-900 font-medium resize-none"
              />
            </div>
            <div className="md:col-span-2">
              <ImageUpload 
                label="Image de Couverture"
                currentImageUrl={form.image_url}
                onUpload={(url) => setForm(f => ({ ...f, image_url: url }))}
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 border border-slate-200 hover:bg-slate-50 transition-all">
                Annuler
              </button>
              <button type="submit" disabled={loading} className="bg-primary text-white px-10 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-[#967a4e] transition-all shadow-2xl shadow-primary/20 disabled:opacity-50">
                {loading ? "Séquençage..." : editingId ? "Actualiser la Signature" : "Déployer le Segment"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {initial.length === 0 ? (
          <div className="col-span-full py-24 text-center bg-white rounded-[2.5rem] border border-slate-100 border-dashed">
            <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
               <Layers size={22} className="text-slate-300" />
            </div>
            <p className="text-slate-400 font-bold text-[9px] uppercase tracking-[0.4em]">Aucun segment défini</p>
          </div>
        ) : (
          initial.map(cat => (
            <div key={cat.id} className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:border-slate-300 transition-all duration-300 relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 overflow-hidden shrink-0">
                  {cat.image_url ? (
                    <img src={cat.image_url} className="w-full h-full object-cover" />
                  ) : (
                    <Tag size={16} />
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="w-8 h-8 rounded-lg bg-white text-slate-400 hover:text-slate-900 hover:bg-slate-50 flex items-center justify-center transition-all border border-slate-200 shadow-sm"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="w-8 h-8 rounded-lg bg-white text-rose-400 hover:text-white hover:bg-rose-500 flex items-center justify-center transition-all border border-slate-200 shadow-sm"
                  >
                    <Trash size={14} />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2">{cat.name}</h3>
              
              <div className="flex items-center gap-2 mb-4">
                 <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 text-[9px] font-black uppercase tracking-widest">
                    <Hash size={10} />
                    {cat.slug}
                 </div>
              </div>
              
              <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                {cat.description || "Aucune description définie."}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
