"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export interface ActiveOffer {
  id: string;
  title: string;
  description: string;
  badge: string;
  price: string;
  type: 'pack' | 'global_promo' | 'specific_promo' | 'product_addon';
  product_id?: string;
  product_ids?: string[];
  link?: string;
}

interface ActiveOfferContextType {
  activeOffer: ActiveOffer | null;
  calculateDiscountedPrice: (originalPrice: number | string, productId: string) => number;
  claimOffer: (offerId: string) => void;
  isClaimed: (offerId: string) => boolean;
}

const ActiveOfferContext = createContext<ActiveOfferContextType>({
  activeOffer: null,
  calculateDiscountedPrice: (p) => Number(p),
  claimOffer: () => {},
  isClaimed: () => false,
});

export function ActiveOfferProvider({ children }: { children: React.ReactNode }) {
  const [activeOffer, setActiveOffer] = useState<ActiveOffer | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'offers'), where('active', '==', true));
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const fetchedOffers = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ActiveOffer & { createdAt?: any }));
        
        // Sort client-side
        fetchedOffers.sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : (a.createdAt ? new Date(a.createdAt) : new Date(0));
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : (b.createdAt ? new Date(b.createdAt) : new Date(0));
          return dateB.getTime() - dateA.getTime();
        });

        setActiveOffer(fetchedOffers[0]);
      } else {
        setActiveOffer(null);
      }
    });

    return () => unsub();
  }, []);

  const [claimedOfferIds, setClaimedOfferIds] = useState<string[]>([]);
  
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('claimed_offers');
      if (stored) {
        setClaimedOfferIds(JSON.parse(stored));
      }
    } catch(e) {}
  }, []);

  const claimOffer = (offerId: string) => {
    setClaimedOfferIds(prev => {
      if (prev.includes(offerId)) return prev;
      const next = [...prev, offerId];
      sessionStorage.setItem('claimed_offers', JSON.stringify(next));
      return next;
    });
  };

  const isClaimed = (offerId: string) => claimedOfferIds.includes(offerId);

  // Helper to calculate the discounted price based on the active offer
  const calculateDiscountedPrice = (originalPrice: number | string, productId: string): number => {
    const priceNum = Number(originalPrice);
    if (isNaN(priceNum) || !activeOffer) return priceNum;

    // Must be claimed to apply discount
    if (!isClaimed(activeOffer.id)) return priceNum;

    // Check if the product is eligible for the offer
    const isEligible = 
      activeOffer.type === 'global_promo' || 
      (activeOffer.type === 'specific_promo' && activeOffer.product_id === productId) ||
      (activeOffer.type === 'pack' && activeOffer.product_ids?.includes(productId));

    if (!isEligible) return priceNum;

    const offerPrice = activeOffer.price?.trim();
    if (!offerPrice) return priceNum;

    // If it's a percentage (e.g., "-20%")
    if (offerPrice.includes('%')) {
      const percentage = parseFloat(offerPrice.replace(/[^0-9.-]/g, ''));
      if (!isNaN(percentage)) {
        // percentage is usually negative, e.g. -20. We want a 20% discount.
        const discountMult = Math.abs(percentage) / 100;
        return priceNum - (priceNum * discountMult);
      }
    }

    // If it's a fixed new price (e.g., "500 DH")
    // Note: Packs might have a single price for all items which makes per-item calculation tricky.
    // For specific promo, it's just the new price.
    if (activeOffer.type === 'specific_promo') {
        const fixedPrice = parseFloat(offerPrice.replace(/[^0-9.]/g, ''));
        if (!isNaN(fixedPrice) && fixedPrice < priceNum) {
            return fixedPrice;
        }
    }

    return priceNum;
  };

  return (
    <ActiveOfferContext.Provider value={{ activeOffer, calculateDiscountedPrice, claimOffer, isClaimed }}>
      {children}
    </ActiveOfferContext.Provider>
  );
}

export const useActiveOffer = () => useContext(ActiveOfferContext);
