"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/lib/types";
import { Plus, X, Pencil, Trash, Search, Star, Filter, ChevronDown, ShoppingBag, Image as ImageIcon, Package, TrendingUp, Sparkles, DollarSign, Upload, Info, Hash } from "lucide-react";
import Papa from "papaparse";
import ImageUpload from "@/components/ImageUpload";
import CustomSelect from "@/components/ui/CustomSelect";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

interface Props {
  products: any[];
  categories: Category[];
}

export default function ProductsClient({ products: initialProducts, categories }: Props) {
  const [products, setProducts] = useState(initialProducts);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ 
    title: "", 
    description: "", 
    price: "", 
    stock_quantity: "", 
    category_id: "", 
    is_featured: "false",
    images: [] as string[]
  });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const catRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Sync local state when initialProducts are updated by router.refresh()
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setIsCatDropdownOpen(false);
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setIsSortDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sortOptions = [
    { value: "newest", label: "Plus Récents" },
    { value: "name-asc", label: "Nom (A-Z)" },
    { value: "price-asc", label: "Prix: Croissant" },
    { value: "price-desc", label: "Prix: Décroissant" },
    { value: "stock-asc", label: "Stock: Faible" },
    { value: "stock-desc", label: "Stock: Élevé" },
  ];

  const filtered = products
    .filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = filterCategory === "" || p.category_id === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc": return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "stock-asc": return a.stock_quantity - b.stock_quantity;
        case "stock-desc": return b.stock_quantity - a.stock_quantity;
        case "name-asc": return a.title.localeCompare(b.title);
        case "newest": default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.stock_quantity) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const oldProducts = [...products];
    const slug = form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const optimisticProduct = {
      id: editingId || `temp-${Date.now()}`,
      title: form.title, slug, description: form.description,
      price: parseFloat(form.price), stock_quantity: parseInt(form.stock_quantity),
      category_id: form.category_id || null, is_featured: form.is_featured === "true",
      images: form.images,
      created_at: new Date().toISOString()
    };

    // OPTIMISTIC UPDATE: Update UI immediately
    if (!editingId) {
      setProducts(prev => [optimisticProduct, ...prev]);
    } else {
      setProducts(prev => prev.map(p => p.id === editingId ? optimisticProduct : p));
    }
    
    const wasEditing = !!editingId;
    setShowForm(false);
    setLoading(true);

    try {
      const endpoint = wasEditing ? "/api/products/update" : "/api/products/create";
      const body = optimisticProduct;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur serveur");
      }

      const serverData = await res.json();
      
      // If it was a new product, we need to swap the temp ID with the real server ID
      if (!wasEditing) {
        setProducts(prev => prev.map(p => p.id === optimisticProduct.id ? serverData : p));
      }

      setEditingId(null);
      setForm({ title: "", description: "", price: "", stock_quantity: "", category_id: "", is_featured: "false", images: [] });
      router.refresh();
    } catch (err: any) {
      // ROLLBACK on error
      setProducts(oldProducts);
      console.error("Error saving product:", err);
      alert(`Erreur: ${err.message || "Impossible d'enregistrer le produit"}`);
      setShowForm(true); // Re-open form so user doesn't lose data
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data as any[];
        if (rows.length === 0) {
          alert("Le fichier CSV est vide.");
          return;
        }

        setIsImporting(true);
        setImportProgress({ current: 0, total: rows.length });
        let successCount = 0;
        let errorCount = 0;

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          setImportProgress(p => ({ ...p, current: i + 1 }));

          const title = row.Titre || row.title || row.Nom || row.Name || row.nom || row.titre;
          const priceStr = row.Prix || row.price || row.prix || "0";
          const price = parseFloat(String(priceStr).replace(',', '.').replace(/[^0-9.]/g, ''));
          const stockStr = row.Stock || row.stock || row.Quantité || row.quantite || "0";
          const stock_quantity = parseInt(String(stockStr).replace(/[^0-9]/g, ''), 10);
          const description = row.Description || row.description || "";
          const is_featured = String(row.Vedette || row.featured || row.premium).toLowerCase() === "true" || row.Vedette === "1";
          
          if (!title || isNaN(price) || isNaN(stock_quantity)) {
            errorCount++;
            continue;
          }

          const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
          const payload = {
            title, slug, description,
            price, stock_quantity,
            category_id: null,
            is_featured,
            images: []
          };

          try {
            const res = await fetch("/api/products/create", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
            if (res.ok) successCount++;
            else errorCount++;
          } catch (err) {
            errorCount++;
          }
        }

        setIsImporting(false);
        alert(`Importation terminée!\nSuccès: ${successCount}\nErreurs/Ignorés: ${errorCount}`);
        router.refresh();
        if (fileInputRef.current) fileInputRef.current.value = "";
      },
      error: (error: any) => {
        alert("Erreur lors de la lecture du fichier CSV: " + error.message);
      }
    });
  };

  const handleEdit = (p: any) => {
    setEditingId(p.id);
    setForm({ 
      title: p.title, 
      description: p.description ?? "", 
      price: String(p.price), 
      stock_quantity: String(p.stock_quantity), 
      category_id: p.category_id ?? "", 
      is_featured: String(p.is_featured),
      images: p.images || []
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce produit ? Cette action est irréversible.")) return;
    const oldProducts = [...products];
    // OPTIMISTIC DELETE
    setProducts(prev => prev.filter(p => p.id !== id));

    try {
      const res = await fetch("/api/products/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur serveur");
      }
      router.refresh();
    } catch (err: any) {
      // ROLLBACK
      setProducts(oldProducts);
      console.error("Error deleting product:", err);
      alert(`Erreur: ${err.message || "Impossible de supprimer le produit"}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      <DashboardHeader 
        title="Gestion Atelier"
        subtitle="Inventaire & Création Exclusive"
        badge="Catalogue"
        icon={ShoppingBag}
        action={
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input 
              type="file" 
              accept=".csv" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
            />

            {/* Info Tooltip */}
            <div className="relative group/csv cursor-help mt-1 sm:mt-0">
                <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-colors shadow-sm">
                    <Info size={18} />
                </div>
                
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-48 bg-slate-800 text-white p-3 rounded-2xl shadow-xl opacity-0 invisible group-hover/csv:opacity-100 group-hover/csv:visible transition-all duration-300 z-50 text-center">
                    <p className="text-[11px] leading-relaxed">
                        <span className="text-emerald-400 font-bold">Obligatoire:</span><br/>Titre, Prix, Stock<br/>
                        <span className="text-slate-400 font-bold mt-2 inline-block">Optionnel:</span><br/>Description, Vedette
                    </p>
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-800 rotate-45"></div>
                </div>
            </div>

            {/* Import Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              className="px-6 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-4 shadow-sm bg-white text-slate-700 border border-slate-200 hover:text-primary hover:border-primary/30 disabled:opacity-50"
            >
              <Upload size={16} className={isImporting ? "animate-bounce" : ""} />
              {isImporting ? `Import... (${importProgress.current}/${importProgress.total})` : "Importer CSV"}
            </button>
            <button
              onClick={() => { 
                if (showForm) {
                  setShowForm(false);
                } else {
                  setEditingId(null); 
                  setForm({ title: "", description: "", price: "", stock_quantity: "", category_id: "", is_featured: "false", images: [] });
                  setShowForm(true);
                }
              }}
              className={`px-10 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-4 shadow-xl ${showForm ? 'bg-white text-slate-900 border border-[#F2EBE1] hover:text-[#1A2E28] shadow-slate-200/10' : 'btn-premium'}`}
            >
              {showForm ? <X size={16} /> : <Plus size={16} />}
              {showForm ? "Fermer l'Atelier" : "Nouvelle Signature"}
            </button>
          </div>
        }
      />

      {!showForm && (
        <div className="flex flex-col md:flex-row gap-4 items-center animate-in fade-in duration-500">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors" size={16} />
            <input
              type="text"
              placeholder="Rechercher une pièce..."
              className="w-full bg-white border border-rose-100 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/30 transition-all text-slate-900 font-medium placeholder:text-slate-300 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="relative min-w-[220px]" ref={catRef}>
             <button
               type="button"
               onClick={() => setIsCatDropdownOpen(!isCatDropdownOpen)}
               className="w-full flex items-center justify-between bg-white border border-rose-100 rounded-xl py-3.5 px-6 text-[10px] font-black text-primary uppercase tracking-widest hover:bg-pink-50 transition-all shadow-sm"
             >
                <div className="flex items-center gap-3">
                   {filterCategory && categories.find(c => c.id === filterCategory)?.image_url ? (
                      <div className="w-5 h-5 rounded-md overflow-hidden border border-primary/20 bg-slate-50">
                        <img src={categories.find(c => c.id === filterCategory)!.image_url!} className="w-full h-full object-cover" alt="" />
                      </div>
                   ) : (
                      <Filter size={14} className="text-primary" />
                   )}
                   <span>{categories.find(c => c.id === filterCategory)?.name || "Toutes Collections"}</span>
                </div>
                <ChevronDown size={14} className={`text-primary/40 transition-transform duration-300 ${isCatDropdownOpen ? 'rotate-180' : ''}`} />
             </button>

             {isCatDropdownOpen && (
               <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-rose-100 rounded-2xl shadow-2xl py-2 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                  <button
                    onClick={() => { setFilterCategory(""); setIsCatDropdownOpen(false); }}
                    className={`w-full text-left px-5 py-4 text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 border-b border-slate-50 ${filterCategory === "" ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${filterCategory === "" ? 'bg-white/10' : 'bg-slate-100'}`}>
                      <Filter size={12} />
                    </div>
                    <span>Toutes Collections</span>
                  </button>
                  <div className="max-h-[300px] overflow-y-auto luxury-scrollbar p-2">
                    {categories.filter(c => c.name).map(c => (
                      <button
                        key={c.id}
                        onClick={() => { setFilterCategory(c.id); setIsCatDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 mb-1 last:mb-0 ${filterCategory === c.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                      >
                        {c.image_url ? (
                          <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-100/50 shrink-0">
                            <img src={c.image_url} className="w-full h-full object-cover" alt="" />
                          </div>
                        ) : (
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${filterCategory === c.id ? 'bg-white/10' : 'bg-slate-100'}`}>
                             <Hash size={12} />
                          </div>
                        )}
                        <span>{c.name}</span>
                      </button>
                    ))}
                  </div>
               </div>
             )}
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/20 p-8 animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-4 mb-8">
             <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-primary">
               {editingId ? <Pencil size={18} /> : <Sparkles size={18} />}
             </div>
             <div>
                <h2 className="text-lg font-black text-slate-900">
                   {editingId ? "Édition du Produit" : "Nouvelle Création"}
                </h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fiche technique et inventaire</p>
             </div>
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Nom Commercial</label>
              <input
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                required
                placeholder="Désignation complète de l'article..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:border-primary/30 focus:bg-white transition-all text-slate-900 font-medium"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Description et caractéristiques..."
                rows={2}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:border-primary/30 focus:bg-white transition-all text-slate-900 font-medium resize-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Prix Vente (DH)</label>
              <div className="relative">
                 <input
                   type="number" step="0.01" value={form.price}
                   onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                   required
                   className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-slate-900 font-black"
                 />
                 <DollarSign size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Stock Initial</label>
              <div className="relative">
                 <input
                   type="number" value={form.stock_quantity}
                   onChange={e => setForm(f => ({ ...f, stock_quantity: e.target.value }))}
                   required
                   className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-slate-900 font-black"
                 />
                 <Package size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
            <CustomSelect
                label="Catégorie"
                options={[{ id: "", name: "Non classé" }, ...categories.map(c => ({ id: c.id, name: c.name, image_url: c.image_url }))]}
                value={form.category_id}
                onChange={(val) => setForm(f => ({ ...f, category_id: val || "" }))}
                placeholder="Sélectionner une catégorie"
                className="w-full"
            />
            <CustomSelect
                label="Mise en avant"
                options={[
                    { id: "false", name: "Standard" },
                    { id: "true", name: "⭐ Premium" }
                ]}
                value={form.is_featured}
                onChange={(val) => setForm(f => ({ ...f, is_featured: val || "false" }))}
                placeholder="Type de mise en avant"
                className="w-full"
            />

            <div className="md:col-span-2 border-t border-slate-50 pt-6">
               <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 ml-1">Galerie Photos (Minimum 1)</label>
               <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-100 group/img">
                      <img src={img} className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))}
                        className="absolute top-2 right-2 w-6 h-6 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-rose-500 opacity-0 group-hover/img:opacity-100 transition-opacity shadow-lg"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <div className="aspect-square">
                    <ImageUpload 
                      label="" 
                      onUpload={(url) => setForm(f => ({ ...f, images: [...f.images, url] }))} 
                    />
                  </div>
               </div>
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-slate-50 mt-4">
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-200 hover:text-slate-900 hover:bg-slate-50 transition-all">
                Annuler
              </button>
              <button type="submit" disabled={loading} className="btn-premium px-10 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all shadow-2xl disabled:opacity-50">
                {loading ? "Séquençage..." : editingId ? "Actualiser la Signature" : "Déployer le Segment"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden mt-8">
        {/* Table header */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-72 group">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-700 transition-colors" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-slate-300 focus:bg-white transition-all text-slate-900"
            />
          </div>
          <div className="flex items-center gap-3">
             <div className="relative min-w-[160px]" ref={sortRef}>
                <button
                  type="button"
                  onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                  className="w-full flex items-center justify-between bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest hover:border-slate-300 transition-all shadow-sm"
                >
                   <div className="flex items-center gap-2">
                      <TrendingUp size={14} className="text-slate-400" />
                      <span>{sortOptions.find(o => o.value === sortBy)?.label}</span>
                   </div>
                   <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isSortDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isSortDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-full min-w-[200px] bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50">
                     {sortOptions.map(option => (
                       <button
                         key={option.value}
                         onClick={() => { setSortBy(option.value); setIsSortDropdownOpen(false); }}
                         className={`w-full text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors ${sortBy === option.value ? 'bg-slate-50 text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                       >
                         {option.label}
                       </button>
                     ))}
                  </div>
                )}
             </div>
             <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest">
                <Package size={14} />
                <span>{filtered.length} art.</span>
             </div>
          </div>
        </div>

        <div className="hidden md:block overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="py-24 text-center">
              <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                 <ShoppingBag size={22} className="text-slate-300" />
              </div>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.5em]">Aucun produit</p>
            </div>
          ) : (
            <table className="w-full text-left min-w-[900px]">
              <thead>
                <tr className="border-b border-slate-100 text-[9px] uppercase font-bold text-slate-400 tracking-[0.25em]">
                  <th className="px-8 py-5">Produit</th>
                  <th className="px-6 py-5 text-center">Catégorie</th>
                  <th className="px-6 py-5 text-center">Statut</th>
                  <th className="px-6 py-5">Prix</th>
                  <th className="px-6 py-5">Stock</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((p: any) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors group">
                    <td className="px-8 py-4">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                             <img 
                               src={p.images?.[0] || "https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=300"} 
                               className="w-full h-full object-cover" 
                               alt=""
                             />
                          </div>
                          <div>
                             <p className="text-sm font-bold text-slate-900 leading-tight">{p.title}</p>
                             <p className="text-[9px] text-slate-400 font-bold truncate max-w-[200px] mt-0.5">{p.description || "Sans description"}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <span className="text-[9px] font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg uppercase tracking-widest">{p.categories?.name ?? "Non classé"}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <div className="flex justify-center">
                        {p.is_featured ? (
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-600 text-[9px] font-black uppercase tracking-wider">
                            <Star size={10} fill="currentColor" /> Vedette
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-slate-400 text-[9px] font-black uppercase tracking-wider">
                            Standard
                          </div>
                        )}
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className="text-sm font-black text-slate-900">{p.price?.toLocaleString()}</span>
                       <span className="text-[9px] font-bold text-primary ml-1 uppercase tracking-widest">DH</span>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${p.stock_quantity > 10 ? 'bg-emerald-500' : p.stock_quantity > 0 ? 'bg-amber-500' : 'bg-rose-500'}`} />
                          <span className="text-sm font-black text-slate-900">{p.stock_quantity}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex justify-end gap-2">
                         <button
                           onClick={() => handleEdit(p)}
                           className="w-8 h-8 rounded-lg bg-white text-slate-400 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 transition-all flex items-center justify-center shadow-sm"
                           title="Modifier"
                         >
                           <Pencil size={14} />
                         </button>
                         <button
                           onClick={() => handleDelete(p.id)}
                           className="w-8 h-8 rounded-lg bg-white text-rose-400 hover:text-white hover:bg-rose-500 border border-slate-200 hover:border-rose-500 transition-all flex items-center justify-center shadow-sm"
                           title="Supprimer"
                         >
                           <Trash size={14} />
                         </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Mobile View: Cards matching Orders style */}
        <div className="md:hidden p-4 flex flex-col gap-4 bg-slate-50/30">
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm">
                 <ShoppingBag size={24} className="text-slate-300" />
              </div>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.5em]">Aucun produit</p>
            </div>
          ) : (
            filtered.map((p: any) => (
              <div key={p.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col gap-5">
                 <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                       <img 
                          src={p.images?.[0] || "https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=300"} 
                          className="w-full h-full object-cover" 
                          alt=""
                       />
                    </div>
                    <div className="min-w-0 pr-2 pt-1">
                       <p className="text-sm font-black text-slate-900 leading-tight mb-1">{p.title}</p>
                       <span className="text-[8px] font-black text-slate-500 bg-slate-100 px-2 py-1 rounded-md uppercase tracking-widest">{p.categories?.name ?? "Non classé"}</span>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-[1.5rem] p-4 border border-slate-100/50">
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Prix Vente</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-black text-slate-900">{p.price?.toLocaleString()}</span>
                        <span className="text-[9px] font-black text-primary uppercase tracking-widest">DH</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Stock dispo</p>
                      <div className="flex items-center gap-2">
                         <div className={`w-2 h-2 rounded-full ${p.stock_quantity > 10 ? 'bg-emerald-500' : p.stock_quantity > 0 ? 'bg-amber-500' : 'bg-rose-500'} animate-pulse`} />
                         <span className={`text-base font-black ${p.stock_quantity > 0 ? 'text-slate-900' : 'text-rose-500'}`}>{p.stock_quantity}</span>
                      </div>
                    </div>
                 </div>

                 <div className="flex items-center gap-3 mt-1">
                    <button
                      onClick={() => handleEdit(p)}
                      className="flex-1 py-3.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-md shadow-slate-900/10"
                    >
                      <Pencil size={12} /> Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all border border-rose-100 shrink-0"
                    >
                      <Trash size={14} />
                    </button>
                 </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
