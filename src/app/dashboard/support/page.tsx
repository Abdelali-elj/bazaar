"use client";
import React, { useState, useEffect, useRef } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, where } from 'firebase/firestore';
import { Send, Loader2, MessageSquare, Search, AlertTriangle, ArrowLeft, ShieldCheck, User } from 'lucide-react';
import { getUser } from '@/lib/actions/auth';
import { sendMessageAction } from '@/lib/actions/support';

export default function AdminSupportPage() {
  const [user, setUser] = useState<any>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getUser().then(u => {
      setUser(u);
      if (!u || !['super_admin', 'owner', 'staff'].includes(u.role)) {
        setLoading(false);
        return; 
      }

      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const msgs: any[] = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        
        const convosMap = new Map();
        msgs.forEach(msg => {
          if (!convosMap.has(msg.userId)) {
            convosMap.set(msg.userId, {
              userId: msg.userId,
              userName: msg.userName || 'Utilisateur',
              lastMessage: msg.text,
              lastMessageTime: msg.createdAt,
              unreadCount: msg.senderRole === 'customer' && !msg.read ? 1 : 0
            });
          } else {
            const existing = convosMap.get(msg.userId);
            if (msg.senderRole === 'customer' && !msg.read) {
              existing.unreadCount += 1;
            }
          }
        });

        const convosList = Array.from(convosMap.values());
        // Sort conversations by newest message
        convosList.sort((a, b) => {
           const timeA = a.lastMessageTime?.seconds ? a.lastMessageTime.seconds * 1000 : new Date(a.lastMessageTime || 0).getTime();
           const timeB = b.lastMessageTime?.seconds ? b.lastMessageTime.seconds * 1000 : new Date(b.lastMessageTime || 0).getTime();
           return timeB - timeA;
        });

        setConversations(convosList);
        setLoading(false);
      }, (error) => {
        console.error("Error fetching conversations:", error);
        setLoading(false);
      });

      return () => unsubscribe();
    });
  }, []);

  useEffect(() => {
    if (!selectedUserId) {
      setMessages([]);
      return;
    }

    const q = query(
      collection(db, 'messages'),
      where('userId', '==', selectedUserId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      
      msgs.sort((a: any, b: any) => {
        const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt || 0).getTime();
        const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt || 0).getTime();
        return timeA - timeB;
      });

      setMessages(msgs);
      
      snapshot.docs.forEach(d => {
        const data = d.data();
        if (data.senderRole === 'customer' && !data.read) {
          updateDoc(doc(db, 'messages', d.id), { read: true });
        }
      });

    }, (error) => console.error("Error fetching chat:", error));

    return () => unsubscribe();
  }, [selectedUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !selectedUserId) return;

    setSending(true);
    const textToSend = newMessage.trim();
    setNewMessage('');

    try {
      const res = await sendMessageAction({
        userId: selectedUserId,
        userName: conversations.find(c => c.userId === selectedUserId)?.userName || 'Utilisateur',
        text: textToSend,
        senderRole: 'admin',
      });
      if (res.error) throw new Error(res.error);
    } catch (err) {
      console.error("Error sending message:", err);
      setNewMessage(textToSend);
    } finally {
      setSending(false);
    }
  };

  const parseDate = (d: any) => {
     if (!d) return new Date();
     return d.toDate ? d.toDate() : new Date(d);
  };

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-slate-200 border-t-[#C9A96E] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="h-[calc(100svh-120px)] md:h-[calc(100vh-140px)] flex flex-col space-y-6">
      
      <div className="shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center border border-[#F2EBE1] shadow-sm transform-gpu hover:-rotate-3 transition-transform hidden sm:flex">
            <ShieldCheck className="text-[#1A2E28]" size={28} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-[#1A2E28] tracking-tighter uppercase leading-none font-outfit">
              Service <span className="text-[#C9A96E] italic font-normal font-playfair lowercase">Client</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.4em] mt-3">Réseau de Conciergerie Bazaar</p>
          </div>
        </div>
        <div className="bg-white px-5 py-3 rounded-2xl border border-[#F2EBE1] shadow-sm flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#1A2E28] hidden sm:block">Ligne Sécurisée Actif</span>
        </div>
      </div>

      <div className="flex-1 min-h-0 bg-white rounded-[3rem] border border-[#F2EBE1] shadow-xl overflow-hidden flex flex-col md:flex-row relative">
        
        {/* Left Sidebar: Conversations List */}
        <div className={`w-full md:w-80 border-r border-[#F2EBE1] flex-col bg-[#FCFBF9]/80 shrink-0 ${selectedUserId ? 'hidden md:flex' : 'flex'} h-full`}>
          <div className="p-6 border-b border-[#F2EBE1] bg-white">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#C9A96E]/50" size={14} />
              <input 
                type="text" 
                placeholder="Chercher un client..." 
                className="w-full bg-[#FCFBF9] border border-[#E8E3DB] rounded-2xl py-4 pl-12 pr-4 text-xs focus:outline-none focus:border-[#C9A96E] focus:ring-4 focus:ring-[#C9A96E]/5 transition-all text-[#1A2E28] placeholder:text-slate-300 font-medium"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {conversations.length === 0 ? (
              <div className="p-12 text-center text-slate-400 flex flex-col items-center">
                <MessageSquare size={32} className="text-[#C9A96E]/30 mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Aucun Ticket</p>
              </div>
            ) : (
              <div className="divide-y divide-[#F2EBE1]">
                {conversations.map(convo => {
                  const isActive = selectedUserId === convo.userId;
                  return (
                    <button 
                      key={convo.userId}
                      onClick={() => setSelectedUserId(convo.userId)}
                      className={`w-full text-left p-6 transition-all relative group ${isActive ? 'bg-white' : 'hover:bg-white'} border-l-4 ${isActive ? 'border-[#C9A96E]' : 'border-transparent'}`}
                    >
                      <div className="flex items-center gap-4 mb-2">
                        <div className={`w-10 h-10 rounded-[1rem] flex items-center justify-center font-black shrink-0 transition-colors ${isActive ? 'bg-[#1A2E28] text-white' : 'bg-slate-50 text-[#1A2E28] border border-[#F2EBE1]'}`}>
                           {convo.userName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className="flex items-center justify-between">
                             <span className="text-xs font-black text-[#1A2E28] truncate pr-4">{convo.userName}</span>
                             <span className="text-[9px] font-bold text-slate-400 shrink-0">
                               {parseDate(convo.lastMessageTime).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}
                             </span>
                           </div>
                           <p className={`text-[11px] truncate mt-0.5 ${convo.unreadCount > 0 ? 'text-[#C9A96E] font-black' : 'text-slate-500 font-medium'}`}>{convo.lastMessage}</p>
                        </div>
                      </div>
                      {convo.unreadCount > 0 && (
                         <div className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#C9A96E] text-white text-[9px] font-black flex items-center justify-center shrink-0 shadow-md shadow-[#C9A96E]/20">
                           {convo.unreadCount}
                         </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Area: Chat Window */}
        <div className={`flex-1 min-w-0 flex-col bg-[#FCFBF9]/30 h-full w-full md:w-auto absolute top-0 left-0 right-0 md:relative z-10 md:z-auto ${selectedUserId ? 'flex' : 'hidden md:flex'}`}>
          {!selectedUserId ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
              <ShieldCheck size={48} className="text-[#C9A96E] mb-6" />
              <p className="text-[#1A2E28] font-black uppercase tracking-widest text-lg">Sélectionnez une conversation</p>
              <p className="text-slate-500 font-medium text-sm mt-3 max-w-sm">Choisissez un client dans la liste pour commencer à apporter votre expertise.</p>
            </div>
          ) : (
            <>
              {/* Decorative Background Text */}
              <div className="absolute inset-0 opacity-[0.01] pointer-events-none text-[80px] font-black uppercase rotate-6 flex flex-wrap gap-10 p-10 leading-none select-none overflow-hidden">
                 CONCIERGERIE VIP BAZAAR STYLE SERVICE CLIENT
              </div>

              {/* Chat Header */}
              <div className="relative z-10 px-6 md:px-10 pt-12 pb-6 border-b border-[#F2EBE1] bg-white backdrop-blur-xl flex items-center justify-between shrink-0 rounded-t-[3rem] md:rounded-t-none min-h-[110px]">
                <div className="flex items-center gap-5 w-full">
                  <button className="md:hidden w-11 h-11 rounded-[1rem] bg-white flex items-center justify-center text-[#1A2E28] border border-[#F2EBE1] shadow-sm hover:border-[#1A2E28] transition-colors shrink-0" onClick={() => setSelectedUserId(null)}>
                     <ArrowLeft size={18} />
                  </button>
                  <div className="relative group shrink-0">
                    <div className="w-11 h-11 rounded-[1.1rem] bg-[#1A2E28] flex items-center justify-center text-white font-bold border border-[#1A2E28] shadow-lg">
                      {conversations.find(c => c.userId === selectedUserId)?.userName.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-black text-[#1A2E28] text-base md:text-lg tracking-tight font-outfit uppercase truncate leading-none mb-1.5">{conversations.find(c => c.userId === selectedUserId)?.userName}</h2>
                    <div className="flex flex-wrap items-center gap-2 font-outfit">
                       <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#C9A96E]/10 border border-[#C9A96E]/20 backdrop-blur-sm">
                          <ShieldCheck size={9} className="text-[#C9A96E]" />
                          <span className="text-[9px] font-black text-[#C9A96E] uppercase tracking-widest">Client VIP</span>
                       </div>
                       <div className="flex items-center px-2.5 py-1 rounded-full bg-slate-50 border border-slate-100">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">ID: {selectedUserId.slice(0, 8)}</span>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages Content */}
              <div className="relative z-10 flex-1 min-h-0 overflow-y-auto p-6 md:p-10 space-y-6 custom-scrollbar">
                {messages.map((msg, idx) => {
                  const isAdmin = msg.senderRole === 'admin';
                  const date = parseDate(msg.createdAt);

                  return (
                    <div key={msg.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'} animate-in fade-in zoom-in duration-300`}>
                      <div className={`max-w-[85%] md:max-w-[70%] flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                        <div className={`px-6 py-4 rounded-[1.5rem] shadow-sm relative ${
                          isAdmin 
                            ? 'bg-[#1A2E28] text-white rounded-tr-sm' 
                            : 'bg-white border border-[#F2EBE1] text-[#1A2E28] rounded-tl-sm'
                        }`}>
                          <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                        </div>
                        <div className="flex items-center gap-3 mt-2 px-2">
                           <span className={`text-[9px] font-black uppercase tracking-widest ${isAdmin ? 'text-slate-400' : 'text-slate-400'}`}>
                             {date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                           </span>
                           {isAdmin && msg.read && (
                              <span className="text-[9px] font-black text-[#C9A96E] uppercase tracking-widest italic flex items-center gap-1">
                                 <ShieldCheck size={10} />
                                 Lu
                              </span>
                           )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Box */}
              <div className="relative z-10 p-6 md:p-8 pt-0 bg-[#FCFBF9]/30">
                <div className="bg-white border border-[#F2EBE1] rounded-[2rem] p-2 transition-all focus-within:ring-4 focus-within:ring-[#C9A96E]/5 focus-within:border-[#C9A96E] shadow-sm">
                   <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Répondre au client..."
                        className="flex-1 bg-transparent border-none py-4 px-6 text-sm focus:outline-none placeholder:text-slate-300 text-[#1A2E28]"
                      />
                      <button
                        type="submit"
                        disabled={sending || !newMessage.trim()}
                        className="w-16 h-14 bg-[#C9A96E] text-white rounded-[1.5rem] flex items-center justify-center hover:bg-[#1A2E28] transition-all disabled:opacity-50 disabled:hover:bg-[#C9A96E] shadow-xl shadow-[#C9A96E]/10 group"
                      >
                        {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                      </button>
                   </form>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
