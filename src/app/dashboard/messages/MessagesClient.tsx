"use client";
import { useState, useEffect } from "react";
import { Search, Mail, MailOpen, User, Calendar, Trash2, Reply, Star, MoreVertical, ChevronRight, Inbox, Sparkles, Send, ShieldCheck } from "lucide-react";

export default function MessagesClient({ initialMessages }: { initialMessages: any[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [selectedId, setSelectedId] = useState<number | null>(initialMessages[0]?.id || null);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);
  const [search, setSearch] = useState("");

  const filtered = messages.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.subject.toLowerCase().includes(search.toLowerCase())
  );

  const selected = messages.find(m => m.id === selectedId);

  const toggleRead = (id: number) => {
    setMessages(prev => prev.map(m => 
      m.id === id ? { ...m, status: m.status === 'read' ? 'unread' : 'read' } : m
    ));
  };

  return (
    <div className="flex h-[calc(100vh-280px)] bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden animate-fade-up">
      {/* Sidebar - List */}
      <div className="w-[400px] border-r border-slate-100 flex flex-col bg-slate-50/30">
        <div className="p-10 border-b border-slate-100 bg-white">
          <div className="flex items-center justify-between mb-8">
             <h2 className="text-2xl font-playfair font-black text-slate-900 italic tracking-tight">Relais <span className="text-primary italic">Atelier</span></h2>
             <div className="bg-[#8ba44a]/10 border border-[#8ba44a]/20 text-[#8ba44a] text-[10px] font-black px-3 py-1.5 rounded-full tracking-widest uppercase">
                {messages.filter(m => m.status === 'unread').length} Nouveaux
             </div>
          </div>
          <div className="relative group">
            <input 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un message..." 
              className="w-full bg-slate-50 border border-rose-100 rounded-2xl py-4.5 pl-12 pr-6 text-[10px] font-black tracking-[0.3em] uppercase focus:outline-none focus:border-primary/30 transition-all text-slate-900 placeholder:text-slate-300 shadow-sm"
            />
            <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
           {filtered.length === 0 ? (
             <div className="py-20 text-center px-10">
                <Inbox size={48} strokeWidth={1} className="mx-auto mb-6 text-slate-300" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Aucun message pour le moment.</p>
             </div>
           ) : filtered.map((m) => (
             <button 
               key={m.id}
               onClick={() => setSelectedId(m.id)}
               className={`w-full text-left p-8 border-b border-slate-100 transition-all hover:bg-slate-50 relative group/item ${selectedId === m.id ? 'bg-[#8ba44a]/5' : ''}`}
             >
               {m.status === 'unread' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-primary rounded-r-full shadow-[0_0_15px_rgba(175,142,92,0.4)]" />}
               <div className="flex justify-between items-start mb-3">
                  <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${m.status === 'unread' ? 'text-primary' : 'text-slate-400'}`}>
                    {m.status === 'unread' ? 'Prestige' : 'Archivé'}
                  </span>
                  <span className="text-[9px] text-slate-500 font-bold">{new Date(m.date).toLocaleDateString("fr-FR", { month: 'short', day: 'numeric' })}</span>
               </div>
               <h4 className={`text-sm tracking-tight mb-2 truncate transition-colors ${m.status === 'unread' ? 'text-slate-900 font-black italic' : 'text-slate-600 font-medium'} group-hover/item:text-slate-900`}>{m.subject}</h4>
               <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{m.name}</p>
               </div>
             </button>
           ))}
        </div>
      </div>

      {/* Content View */}
      <div className="flex-1 flex flex-col bg-white relative">
        {selected ? (
          <>
            <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-white">
               <div className="flex items-center gap-6">
                  <div className="relative">
                     <div className="w-16 h-16 rounded-3xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm">
                        <User size={28} strokeWidth={1} />
                     </div>
                     <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-xl border-2 border-white flex items-center justify-center text-white shadow-lg">
                        <ShieldCheck size={14} />
                     </div>
                  </div>
                  <div>
                     <h3 className="text-xl font-playfair font-black text-slate-900 italic tracking-tight">{selected.name}</h3>
                     <p className="text-[10px] text-primary font-black uppercase tracking-[0.4em] mt-1.5">{selected.email}</p>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <button onClick={() => toggleRead(selected.id)} className="w-12 h-12 bg-white border border-rose-100 shadow-sm rounded-2xl text-primary/40 hover:text-primary hover:bg-pink-50 transition-all flex items-center justify-center" title="Marquer comme lu/non lu">
                     {selected.status === 'read' ? <MailOpen size={20} /> : <Mail size={20} />}
                  </button>
                  <button className="w-12 h-12 bg-white border border-rose-100 shadow-sm rounded-2xl text-primary/40 hover:text-amber-500 hover:bg-pink-50 transition-all flex items-center justify-center">
                     <Star size={20} />
                  </button>
                  <button className="w-12 h-12 bg-rose-50 border border-rose-100 rounded-2xl text-rose-500 hover:text-white hover:bg-rose-500 transition-all flex items-center justify-center shadow-sm">
                     <Trash2 size={20} />
                  </button>
               </div>
            </div>

            <div className="flex-1 p-16 overflow-y-auto custom-scrollbar bg-pink-50/10">
               <div className="max-w-4xl mx-auto">
                  <div className="flex items-center gap-4 mb-10">
                     <div className="p-2 bg-pink-50 rounded-lg text-primary">
                        <Calendar size={14} />
                     </div>
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Reçu le {new Date(selected.date).toLocaleString("fr-FR", { dateStyle: 'full', timeStyle: 'short' })}</span>
                  </div>
                  <h1 className="text-5xl font-playfair text-slate-900 mb-10 font-black italic leading-[1.1] tracking-tight">{selected.subject}</h1>
                  <div className="relative">
                     <div className="absolute left-[-40px] top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary/20 to-transparent opacity-30" />
                     <p className="text-slate-700 text-lg leading-[1.8] font-medium whitespace-pre-wrap selection:bg-primary/20">
                        {selected.message}
                     </p>
                  </div>
                  <div className="mt-16 flex items-center gap-4 opacity-50">
                     <Sparkles size={16} className="text-primary" />
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Fin du message</span>
                  </div>
               </div>
            </div>

            <div className="p-10 border-t border-rose-100 bg-white">
               <div className="max-w-4xl mx-auto flex items-center gap-6">
                  <button className="flex items-center gap-5 px-14 py-6 bg-primary text-white rounded-[2rem] shadow-2xl shadow-primary/20 text-[11px] font-black uppercase tracking-[0.3em] hover:brightness-110 transition-all">
                     <Reply size={18} />
                     Signer une Réponse
                  </button>
                  <button className="w-14 h-14 bg-white border border-rose-100 shadow-sm rounded-2xl text-primary/40 hover:text-primary hover:bg-pink-50 flex items-center justify-center transition-all">
                     <MoreVertical size={24} />
                  </button>
               </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
             <div className="w-32 h-32 rounded-full border border-slate-200 bg-white flex items-center justify-center mb-8 relative shadow-sm">
                <Send size={48} strokeWidth={1} className="opacity-40 translate-x-1 -translate-y-1" />
             </div>
             <p className="text-[11px] font-black uppercase tracking-[0.6em] text-slate-500">Sélectionnez un message</p>
          </div>
        )}
      </div>
    </div>
  );
}
