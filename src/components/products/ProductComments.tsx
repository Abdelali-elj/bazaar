"use client";
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { Star, MessageCircle, Quote, User, Clock } from 'lucide-react';

interface Comment {
    id: string;
    userName: string;
    text: string;
    rating: number;
    productId: string;
    productName: string;
    productImage: string;
    createdAt: any;
}

interface ProductCommentsProps {
    productId: string;
}

export default function ProductComments({ productId }: ProductCommentsProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!productId) return;
        
        const q = query(
            collection(db, 'comments'),
            where('productId', '==', productId),
            orderBy('createdAt', 'desc')
        );

        const unsub = onSnapshot(q, (snap) => {
            setComments(snap.docs.map(d => ({ id: d.id, ...d.data() } as Comment)));
            setLoading(false);
        }, (err) => {
            console.error("Error fetching comments:", err);
            setLoading(false);
        });

        return () => unsub();
    }, [productId]);

    const formatDate = (timestamp: any) => {
        if (!timestamp) return "Récemment";
        const date = timestamp.toDate();
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        
        if (diffInSeconds < 60) return "À l'instant";
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} h`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} j`;
        return date.toLocaleDateString();
    };

    if (loading && comments.length === 0) return (
        <div className="py-20 text-center animate-pulse">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">Chargement des avis...</p>
        </div>
    );

    if (comments.length === 0) return null;

    return (
        <div className="space-y-10 pt-16">
            <div className="flex items-center gap-4">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#1A1A1A]">Derniers Retours</h3>
                <div className="h-px flex-grow bg-gray-50" />
                <span className="text-[10px] font-bold text-[#C9A96E]">{comments.length} AVIS</span>
            </div>

            <div className="space-y-6">
                {comments.map((comment) => {
                    const colors = ['bg-[#FF6B6B]', 'bg-[#4ECDC4]', 'bg-[#45B7D1]', 'bg-[#96CEB4]', 'bg-[#FFEEAD]', 'bg-[#D4A5A5]', 'bg-[#9B59B6]'];
                    const avatarBg = colors[Math.abs(comment.userName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % colors.length];

                    return (
                        <div 
                            key={comment.id}
                            className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm animate-fade-in relative group"
                        >
                            {/* Stars at Top */}
                            <div className="flex gap-1 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star 
                                        key={i} 
                                        size={14} 
                                        fill={i < comment.rating ? "#FFC107" : "none"} 
                                        stroke={i < comment.rating ? "#FFC107" : "#D5CFC6"} 
                                        strokeWidth={1}
                                    />
                                ))}
                            </div>

                            {/* Comment Text */}
                            <div className="mb-6">
                                <p className="text-[15px] text-[#2D3748] leading-relaxed italic font-medium" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    "{comment.text}"
                                </p>
                            </div>

                            {/* Separator */}
                            <div className="w-full h-px bg-[#FAF9F6] mb-6" />

                            {/* Footer: Avatar & User Info */}
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className={`w-12 h-12 rounded-full ${avatarBg} flex items-center justify-center text-white shadow-inner`}>
                                        <User size={20} />
                                    </div>
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#38BDF8] border-2 border-white rounded-full shadow-sm" />
                                </div>
                                <div className="flex items-center gap-3">
                                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#1A1A1A]">
                                        {comment.userName}
                                    </h4>
                                    <span className="text-[9px] font-bold text-slate-400/80 uppercase tracking-widest flex items-center gap-1.5">
                                        <Clock size={10} />
                                        {formatDate(comment.createdAt)}
                                    </span>
                                </div>
                            </div>

                            <Quote size={30} className="absolute top-8 right-8 text-[#C9A96E]/5" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
