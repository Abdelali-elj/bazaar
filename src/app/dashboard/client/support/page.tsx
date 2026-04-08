"use client";
import React, { useState, useEffect, useRef } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { Send, Loader2, MessageSquare, AlertTriangle, Sparkles, User, ShieldCheck } from 'lucide-react';
import { getUser } from '@/lib/actions/auth';
import { sendMessageAction } from '@/lib/actions/support';

export default function ClientSupportPage() {
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sendError, setSendError] = useState('');

  useEffect(() => {
    getUser().then(u => {
      setUser(u);
      if (!u) {
        setLoading(false);
        return;
      }
      
      const q = query(
        collection(db, 'messages'),
        where('userId', '==', u.uid)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Sort strictly on the client side to avoid Firebase composite index errors
        msgs.sort((a: any, b: any) => {
          const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt || 0).getTime();
          const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt || 0).getTime();
          return timeA - timeB;
        });

        setMessages(msgs);
        setLoading(false);
      }, (error) => {
        console.error("Error fetching messages:", error);
        setSendError("Erreur de connexion. Veuillez réessayer.");
        setLoading(false);
      });

      return () => unsubscribe();
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    setSending(true);
    const textToSend = newMessage.trim();
    setNewMessage('');

    try {
      const res = await sendMessageAction({
        userId: user.uid,
        userName: user.profile?.first_name || user.email || "Client",
        text: textToSend,
        senderRole: 'customer'
      });
      
      if (res.error) throw new Error(res.error);
    } catch (err: any) {
      console.error("Error sending message:", err);
      setNewMessage(textToSend);
      setSendError("Envoi échoué. Veuillez vérifier votre connexion.");
      setTimeout(() => setSendError(''), 5000);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-100 border-t-[#C9A96E] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col space-y-8 animate-in fade-in duration-1000 h-[calc(100svh-120px)] md:h-[calc(100vh-140px)]">
      <div className="shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center border border-[#F2EBE1] shadow-sm transform-gpu hover:rotate-3 transition-transform">
            <MessageSquare className="text-[#C9A96E]" size={28} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-[#1A2E28] tracking-tighter uppercase leading-none font-outfit">
              Support <span className="text-[#C9A96E] italic font-normal font-playfair lowercase">Privé</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.4em] mt-3">Assistance Signature Bazaar Style</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3 px-6 py-3 bg-white rounded-2xl border border-[#F2EBE1] shadow-sm">
           <ShieldCheck size={16} className="text-emerald-500" />
           <span className="text-[10px] font-black uppercase tracking-widest text-[#1A2E28]">Connexion Sécurisée</span>
        </div>
      </div>

      <div className="flex-1 min-h-0 bg-white rounded-[3rem] border border-[#F2EBE1] shadow-2xl overflow-hidden flex flex-col relative">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-[0.01] pointer-events-none text-[80px] font-black uppercase rotate-6 flex flex-wrap gap-10 p-10 leading-none select-none">
           BAZAAR SUPPORT LUXURY EXPERIENCE SERVICE CLIENT
        </div>

        {/* Chat Header */}
        <div className="relative z-10 px-10 py-6 border-b border-[#F2EBE1] bg-white/80 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="w-12 h-12 rounded-2xl bg-[#1A2E28] flex items-center justify-center text-[#C9A96E] font-black border-2 border-white shadow-xl group-hover:scale-105 transition-transform">
                BA
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white shadow-sm" />
            </div>
            <div>
              <p className="font-black text-[#1A2E28] text-base tracking-tight font-outfit uppercase">Conciergerie Bazaar</p>
              <div className="flex items-center gap-2">
                 <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Disponible</span>
                 <span className="w-1 h-1 rounded-full bg-slate-200" />
                 <span className="text-[10px] font-medium text-slate-400">Temps de réponse {'<'} 10 min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="relative z-10 flex-1 min-h-0 overflow-y-auto p-6 md:p-10 space-y-8 bg-[#FCFBF9]/30 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-white rounded-[2rem] border border-[#F2EBE1] flex items-center justify-center mb-8 shadow-sm animate-bounce-subtle">
                 <Sparkles size={40} className="text-[#C9A96E]/30" />
              </div>
              <h3 className="text-xl font-black text-[#1A2E28] uppercase tracking-wider mb-3">Une question de style ?</h3>
              <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed font-medium">
                Notre équipe dédiée est à votre entière disposition pour vous accompagner dans votre rituel de beauté.
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isMine = msg.senderRole === 'customer';
              const date = msg.createdAt?.toDate ? msg.createdAt.toDate() : (msg.createdAt ? new Date(msg.createdAt) : new Date());

              return (
                <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                  <div className={`max-w-[70%] flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                    <div className={`px-6 py-4 rounded-[1.5rem] shadow-sm relative ${
                      isMine 
                        ? 'bg-[#1A2E28] text-white rounded-tr-sm' 
                        : 'bg-white border border-[#F2EBE1] text-[#1A2E28] rounded-tl-sm'
                    }`}>
                      <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-3 px-1">
                       <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                        {date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isMine && msg.read && (
                         <span className="text-[9px] font-black text-[#C9A96E] uppercase tracking-widest italic flex items-center gap-1">
                            <ShieldCheck size={10} />
                            Lu
                         </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="relative z-10 p-8 pt-0 bg-white">
          <div className="bg-[#FCFBF9] border border-[#F2EBE1] rounded-[2rem] p-2 transition-all focus-within:ring-4 focus-within:ring-[#C9A96E]/5 focus-within:border-[#C9A96E]">
             <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Posez votre question à notre expert..."
                  className="flex-1 bg-transparent border-none py-4 px-6 text-sm focus:outline-none placeholder:text-slate-300 text-[#1A2E28]"
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="w-16 h-14 bg-[#1A2E28] text-white rounded-2xl flex items-center justify-center hover:bg-[#C9A96E] transition-all disabled:opacity-50 disabled:hover:bg-[#1A2E28] shadow-xl shadow-[#1A1A1A]/10 group"
                >
                  {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                </button>
             </form>
          </div>
          {sendError && (
            <div className="mt-4 flex items-center gap-2 p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-500 text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-top-2">
              <AlertTriangle size={14} className="shrink-0" />
              {sendError}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
