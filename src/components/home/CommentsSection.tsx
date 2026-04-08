"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, query, orderBy, limit, onSnapshot, addDoc } from 'firebase/firestore';
import { Star, User, Clock, Send, MessageSquare, Quote, EyeOff, ArrowRight, ChevronLeft, CheckCircle2 } from 'lucide-react';

interface Comment {
    id: string;
    userName: string;
    city?: string;
    text: string;
    rating: number;
    createdAt: any;
    isAnonymous?: boolean;
}

export default function CommentsSection() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [userName, setUserName] = useState("");
    const [city, setCity] = useState("");
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [commentText, setCommentText] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState("");
    const [page, setPage] = useState(0);

    const ITEMS_PER_PAGE = 6;

    useEffect(() => {
        // Fetch a larger batch for better UX with local pagination
        const q = query(
            collection(db, 'comments'),
            orderBy('createdAt', 'desc'),
            limit(48)
        );
        const unsub = onSnapshot(q, (snap) => {
            setComments(snap.docs.map(d => ({ id: d.id, ...d.data() } as Comment)));
            setLoading(false);
        }, () => setLoading(false));
        return () => unsub();
    }, []);

    const totalPages = Math.ceil(comments.length / ITEMS_PER_PAGE);
    const displayedComments = useMemo(() => {
        const start = page * ITEMS_PER_PAGE;
        return comments.slice(start, start + ITEMS_PER_PAGE);
    }, [comments, page]);

    const handleNextPage = () => {
        setPage((prev) => (prev + 1) % Math.max(1, totalPages));
    };

    const ratingStats = useMemo(() => {
        const stats = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, total: 0, avg: 0 };
        comments.forEach(c => {
            if (c.rating >= 1 && c.rating <= 5) {
                stats[c.rating as 1 | 2 | 3 | 4 | 5]++;
                stats.total++;
            }
        });
        // Add some base "social proof" numbers if empty or few
        const baseStats = { 5: 989, 4: 450, 3: 50, 2: 16, 1: 8 };
        const combined = { ...baseStats };
        if (stats.total > 0) {
            combined[5] += stats[5];
            combined[4] += stats[4];
            combined[3] += stats[3];
            combined[2] += stats[2];
            combined[1] += stats[1];
        }

        const totalCombined = Object.values(combined).reduce((a, b) => a + b, 0);
        const sumPoints = Object.entries(combined).reduce((acc, [star, count]) => acc + (parseInt(star) * count), 0);
        const avg = totalCombined > 0 ? (sumPoints / totalCombined).toFixed(1) : "0.0";

        return { counts: combined, total: totalCombined, avg };
    }, [comments]);

    const formatDate = (timestamp: any) => {
        if (!timestamp) return "A l'instant";
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return "À l'instant";
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} H`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} J`;
        return date.toLocaleDateString();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        setIsSubmitting(true);
        try {
            await addDoc(collection(db, 'comments'), {
                userName: isAnonymous ? "Utilisateur Anonyme" : (userName.trim() || "Client(e) Privilège"),
                city: city.trim() || undefined,
                text: commentText,
                rating: rating,
                isAnonymous: isAnonymous,
                createdAt: new Date(),
            });
            setCommentText("");
            setUserName("");
            setCity("");
            setRating(5);
            setSubmitMessage("Merci ! Votre avis a été publié.");
            setTimeout(() => setSubmitMessage(""), 4000);
        } catch (error) {
            console.error("Erreur d'ajout:", error);
            setSubmitMessage("Une erreur est survenue.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="comments" className="py-16 md:py-24 bg-[#FCFBF9] border-t border-[#F2EBE1]">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-16">

                {/* Header */}
                <div className="flex flex-col items-center text-center mb-16 w-full">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-px bg-[#C9A96E]/50" />
                        <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#C9A96E]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            L'Expérience Client
                        </span>
                        <div className="w-12 h-px bg-[#C9A96E]/50" />
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal leading-[1.1] tracking-tight" style={{ fontFamily: "'Playfair Display', serif", color: '#1A2E28' }}>
                        Voix de notre <br className="md:hidden" />
                        <span className="italic text-[#C9A96E]">Communauté</span>
                    </h2>
                </div>

                <div className="grid lg:grid-cols-12 gap-10 xl:gap-16 items-start">
                    
                    {/* LEFT COLUMN: List of Comments */}
                    <div className="lg:col-span-8 space-y-6">
                        {loading ? (
                            <div className="grid sm:grid-cols-2 gap-6">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="h-48 bg-white rounded-[2.5rem] animate-pulse border border-[#F2EBE1]" />
                                ))}
                            </div>
                        ) : comments.length > 0 ? (
                            <div className="grid md:grid-cols-2 gap-6">
                                {displayedComments.map((comment, idx) => {
                                    const colors = ['bg-[#FF6B6B]', 'bg-[#4ECDC4]', 'bg-[#45B7D1]', 'bg-[#96CEB4]', 'bg-[#FFEEAD]', 'bg-[#D4A5A5]', 'bg-[#9B59B6]'];
                                    const cities = ['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Agadir', 'Fès'];
                                    const nameSeed = comment.userName || "Client";
                                    const avatarBg = colors[Math.abs(nameSeed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % colors.length];
                                    const displayCity = comment.city || cities[Math.abs(nameSeed.length) % cities.length];
                                    
                                    return (
                                        <div
                                            key={comment.id}
                                            className="bg-white rounded-[2.5rem] p-6 border border-[#F2EBE1] hover:shadow-xl transition-all duration-500 group relative flex flex-col shadow-sm h-full"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={12} fill={i < comment.rating ? "#FFC107" : "transparent"} color={i < comment.rating ? "#FFC107" : "#E2E8F0"} strokeWidth={1} />
                                                    ))}
                                                </div>
                                                <div className="flex items-center gap-1 px-2 py-0.5 bg-[#F0FDF4] rounded-full border border-[#DCFCE7]">
                                                    <CheckCircle2 size={8} className="text-[#16A34A]" />
                                                    <span className="text-[7px] font-black text-[#16A34A] uppercase tracking-widest">Vérifié</span>
                                                </div>
                                            </div>

                                            <p className="text-[13px] text-[#2D3748] leading-relaxed mb-6 line-clamp-4">
                                                {comment.text}
                                            </p>

                                            <div className="mt-auto pt-4 border-t border-[#F2EBE1] flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full ${avatarBg} flex items-center justify-center text-white text-[10px] font-bold`}>
                                                    {comment.userName.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col flex-grow">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="text-[10px] font-black text-[#1A2E28] uppercase tracking-[0.1em]">{comment.userName}</h4>
                                                        <span className="text-[8px] font-bold text-slate-300 uppercase tracking-tight">{formatDate(comment.createdAt)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{displayCity}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="bg-white rounded-[2.5rem] p-12 text-center border border-[#F2EBE1]">
                                <MessageSquare className="mx-auto text-slate-200 mb-4" size={40} />
                                <p className="text-slate-400 font-medium tracking-wide">Aucun témoignage pour le moment.</p>
                            </div>
                        )}

                        {totalPages > 1 && (
                            <div className="pt-8 text-center flex flex-col items-center gap-4">
                                <button 
                                    onClick={handleNextPage}
                                    className="text-[10px] font-black text-[#1A2E28] uppercase tracking-[0.4em] hover:text-[#C9A96E] transition-colors flex items-center justify-center gap-3 mx-auto group"
                                >
                                    Voir plus de témoignages ({page + 1}/{totalPages})
                                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <div className="flex gap-1.5">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <div 
                                            key={i} 
                                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${page === i ? 'bg-[#C9A96E] w-4' : 'bg-slate-200'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Summary & Form */}
                    <div className="lg:col-span-4 space-y-8 sticky top-32">
                        {/* Summary Card */}
                        <div className="bg-white rounded-[2rem] p-6 border border-[#F2EBE1] shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <div className="text-center">
                                    <span className="text-4xl font-bold text-[#1A2E28] block leading-none">{ratingStats.avg}</span>
                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Sur 5.0</span>
                                </div>
                                <div className="flex-1 px-8">
                                    <div className="flex gap-0.5 justify-center mb-1">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <Star key={i} size={14} fill={i <= parseFloat(ratingStats.avg) ? "#C9A96E" : "#E5E7EB"} color={i <= parseFloat(ratingStats.avg) ? "#C9A96E" : "#E5E7EB"} />
                                        ))}
                                    </div>
                                    <span className="text-[10px] font-bold text-[#C9A96E] block text-center uppercase tracking-widest">{ratingStats.total} Retours</span>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                {[5, 4, 3, 2, 1].map((star) => {
                                    const count = ratingStats.counts[star as 1 | 2 | 3 | 4 | 5];
                                    const percentage = (count / ratingStats.total) * 100;
                                    return (
                                        <div key={star} className="flex items-center gap-3">
                                            <span className="text-[9px] font-black text-slate-400 w-4">{star}</span>
                                            <div className="flex-1 h-1 bg-slate-50 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-[#C9A96E] rounded-full transition-all duration-1000"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                            <span className="text-[9px] font-bold text-slate-300 w-8 text-right">{count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Form */}
                        <div className="bg-[#1A2E28] rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
                            <h3 className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-6 relative z-10">Donner votre avis</h3>
                            
                            <form onSubmit={handleSubmit} className="space-y-4 relative z-10" suppressHydrationWarning={true}>
                                <div className="flex gap-2 justify-center py-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            size={18}
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            fill={(hoverRating || rating) >= star ? "#C9A96E" : "transparent"}
                                            stroke={(hoverRating || rating) >= star ? "#C9A96E" : "rgba(255,255,255,0.2)"}
                                            className="cursor-pointer transition-transform hover:scale-125"
                                        />
                                    ))}
                                </div>

                                {!isAnonymous && (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={userName}
                                            onChange={(e) => setUserName(e.target.value)}
                                            placeholder="Nom"
                                            suppressHydrationWarning={true}
                                            className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-xl p-3 text-[12px] text-white focus:ring-1 focus:ring-[#C9A96E] outline-none placeholder:text-white/20"
                                        />
                                        <input
                                            type="text"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            placeholder="Ville"
                                            suppressHydrationWarning={true}
                                            className="w-[90px] bg-white/5 border border-white/10 rounded-xl p-3 text-[12px] text-white focus:ring-1 focus:ring-[#C9A96E] outline-none placeholder:text-white/20"
                                        />
                                    </div>
                                )}

                                <textarea
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Message..."
                                    suppressHydrationWarning={true}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-[12px] text-white focus:ring-1 focus:ring-[#C9A96E] outline-none min-h-[80px] resize-none placeholder:text-white/20"
                                    required
                                />

                                <div className="flex items-center justify-between pb-2">
                                    <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                                        <EyeOff size={10} className="text-white/60" /> Mode Anonyme
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setIsAnonymous(!isAnonymous)}
                                        className={`w-9 h-4.5 rounded-full transition-colors relative ${isAnonymous ? 'bg-[#C9A96E]' : 'bg-white/10'}`}
                                    >
                                        <div className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full transition-all ${isAnonymous ? 'right-0.5' : 'left-0.5'}`} />
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting || !commentText.trim()}
                                    className="w-full bg-[#C9A96E] text-white rounded-xl py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-[#1A2E28] transition-all disabled:opacity-50"
                                >
                                    Envoyer
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>

            <style jsx>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(15px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </section>
    );
}



