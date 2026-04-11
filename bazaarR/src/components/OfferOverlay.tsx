
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, query, where, onSnapshot, limit, orderBy, doc, getDoc } from 'firebase/firestore';
import { X, Sparkles, ArrowRight, Zap } from 'lucide-react';
import ProductQuickView from '@/components/products/ProductQuickView';
import { useRouter, usePathname } from 'next/navigation';
import { useActiveOffer } from '@/components/ActiveOfferContext';

export default function OfferOverlay() {
  const { activeOffer: globalActiveOffer, claimOffer } = useActiveOffer();
  const [activeOffer, setActiveOffer] = useState<any>(null);
  const [productData, setProductData] = useState<any>(null);
  const [visible, setVisible] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Listen for the most recent active offer
    const q = query(
      collection(db, 'offers'),
      where('active', '==', true)
    );

    const unsub = onSnapshot(q, async (snap) => {
      if (!snap.empty) {
        const fetchedOffers = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
        // Sort client-side to avoid composite index requirement
        fetchedOffers.sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : (a.createdAt ? new Date(a.createdAt) : new Date(0));
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : (b.createdAt ? new Date(b.createdAt) : new Date(0));
          return dateB.getTime() - dateA.getTime();
        });

        const offer = fetchedOffers[0];
        
        // Check if this offer has been closed in this session
        const closedOffers = JSON.parse(sessionStorage.getItem('closed_offers') || '[]');
        if (closedOffers.includes(offer.id)) {
          setVisible(false);
          return;
        }

        setActiveOffer(offer);
        
        // If it's a specific product, fetch its details
        if (offer.product_id) {
          const pDoc = await getDoc(doc(db, 'products', offer.product_id));
          if (pDoc.exists()) {
            setProductData({ id: pDoc.id, ...pDoc.data() });
          }
        } else {
          setProductData(null);
        }

        // Delay visibility slightly for effect
        setTimeout(() => setVisible(true), 1500);
      } else {
        setVisible(false);
      }
    });

    return () => unsub();
  }, []);

  const handleClose = () => {
    if (activeOffer) {
      const closedOffers = JSON.parse(sessionStorage.getItem('closed_offers') || '[]');
      closedOffers.push(activeOffer.id);
      sessionStorage.setItem('closed_offers', JSON.stringify(closedOffers));
    }
    setVisible(false);
  };

  const handleAction = () => {
    if (activeOffer) claimOffer(activeOffer.id);
    if (activeOffer?.type === 'specific_promo' || activeOffer?.type === 'product_addon') {
      if (productData) {
        setShowQuickView(true);
      }
    } else {
      // For global promo or packs, direct to the link or the products page
      handleClose();
      if (activeOffer?.link) {
        router(activeOffer.link);
      }
    }
  };

  if (pathname?.startsWith('/dashboard')) return null;
  if (!visible || !activeOffer) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md animate-in fade-in duration-500">
      <div className="relative w-full max-w-xl bg-white rounded-[3.5rem] shadow-2xl shadow-black/20 overflow-hidden border border-[#E8E3DB] animate-in zoom-in-95 slide-in-from-bottom-10 duration-700">
        
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none grayscale">
           <Zap size={200} />
        </div>

        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-8 right-8 w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all z-20"
        >
          <X size={18} />
        </button>

        <div className="relative z-10 p-12 pt-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#C9A96E]/10 rounded-full border border-[#C9A96E]/20 mb-8 animate-bounce-subtle">
             <Sparkles size={14} className="text-[#C9A96E]" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C9A96E]">{activeOffer.badge || 'Offre Exclusive'}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
            <div className="space-y-4">
              <h2 className="text-5xl font-bold text-[#1A2E28] tracking-tighter leading-none font-outfit uppercase">
                {activeOffer.title}
              </h2>
              <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-md">
                {activeOffer.description || "Profitez de cette offre exceptionnelle limitée dans le temps. C'est le moment idéal pour sublimer votre rituel."}
              </p>
            </div>

            {/* Product Card for Specific Promo */}
            {(activeOffer.type === 'specific_promo' || activeOffer.type === 'product_addon') && productData && (
              <div className="bg-[#F8FAF5] rounded-3xl p-6 border border-[#E8E3DB] flex items-center gap-6 group hover:border-[#C9A96E]/30 transition-all">
                <div className="w-24 h-24 rounded-2xl bg-white border border-[#E8E3DB] overflow-hidden group-hover:scale-105 transition-transform">
                  <img 
                    src={productData.images?.[0] || productData.image} 
                    alt={productData.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-[11px] font-black text-[#1A2E28] uppercase tracking-widest mb-1">{productData.title}</h4>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-black text-[#1A2E28]">{productData.price} DH</span>
                    {activeOffer.price && activeOffer.price !== productData.price && (
                       <span className="text-[10px] font-bold text-[#C9A96E] line-through opacity-50">{activeOffer.price}</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Price Highlight for Global/Pack */}
            {(activeOffer.type === 'global_promo' || activeOffer.type === 'pack') && (
              <div className="text-6xl font-black text-[#1A2E28] tracking-tighter mb-4">
                {activeOffer.price}
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="mt-10">
            <button 
              onClick={handleAction}
              className="w-full py-6 bg-[#1A1A1A] text-white text-[11px] font-black uppercase tracking-[0.4em] rounded-2xl flex items-center justify-center gap-4 hover:bg-[#C9A96E] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-black/10 group"
            >
              {activeOffer.type === 'specific_promo' || activeOffer.type === 'product_addon' 
                ? 'Ajouter au rituel' 
                : 'En profiter maintenant'}
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

      {showQuickView && (
          <ProductQuickView 
              product={productData} 
              onClose={() => {
                  setShowQuickView(false);
                  handleClose();
              }} 
          />
      )}

      
    </div>
  );
}
