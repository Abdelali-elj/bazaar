
import React, { useState, useEffect } from 'react';
import { X, Sparkles, ArrowRight, Zap } from 'lucide-react';
import { useNavigate as useRouter } from "react-router-dom";
import { db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { useActiveOffer } from '@/components/ActiveOfferContext';

interface OfferModalProps {
  offer: any | null;
  onClose: () => void;
}

export default function OfferModal({ offer, onClose }: OfferModalProps) {
  const router = useRouter();
  const { claimOffer } = useActiveOffer();
  
  if (!offer) return null;

  const handleAction = () => {
    claimOffer(offer.id);
    onClose();
    if (offer.link) {
      router(offer.link);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="absolute inset-0"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl bg-white rounded-[3.5rem] shadow-2xl shadow-black/20 overflow-hidden border border-[#E8E3DB] animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
        
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none grayscale">
           <Zap size={200} />
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all z-20"
        >
          <X size={18} />
        </button>

        <div className="relative z-10 p-12 pt-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#C9A96E]/10 rounded-full border border-[#C9A96E]/20 mb-8 animate-bounce-subtle">
             <Sparkles size={14} className="text-[#C9A96E]" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C9A96E]">{offer.badge || 'Offre Exclusive'}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
            <div className="space-y-4">
              <h2 className="text-5xl font-bold text-[#1A2E28] tracking-tighter leading-none font-outfit uppercase">
                {offer.title}
              </h2>
              <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-md">
                {offer.description || "Profitez de cette offre exceptionnelle limitée dans le temps. C'est le moment idéal pour sublimer votre rituel."}
              </p>
            </div>

            {/* Price Highlight for Global/Pack */}
            {(offer.type === 'global_promo' || offer.type === 'pack' || !offer.type) && (
              <div className="text-6xl font-black text-[#1A2E28] tracking-tighter mb-4">
                {offer.price}
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="mt-10">
            <button 
              onClick={handleAction}
              className="w-full py-6 bg-[#1A1A1A] text-white text-[11px] font-black uppercase tracking-[0.4em] rounded-2xl flex items-center justify-center gap-4 hover:bg-[#C9A96E] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-black/10 group"
            >
              En profiter maintenant
              <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>

          {/* Fine Print */}
          <p className="text-center text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-8 flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-slate-100" />
            Offre limitée
            <span className="w-8 h-px bg-slate-100" />
          </p>
        </div>
      </div>

      
    </div>
  );
}
