
import React, { useState } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Star, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

interface ReviewFormProps {
    productId: string;
    productName: string;
    productImage: string;
}

export default function ReviewForm({ productId, productName, productImage }: ReviewFormProps) {
    const [name, setName] = useState('');
    const [text, setText] = useState('');
    const [rating, setRating] = useState(5);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !text) return;

        setSubmitting(true);
        try {
            await addDoc(collection(db, 'comments'), {
                userName: name,
                text,
                rating,
                productId,
                productName,
                productImage, // Store product image for the home page display
                createdAt: serverTimestamp(),
            });
            setSuccess(true);
            setName('');
            setText('');
            setRating(5);
        } catch (error) {
            console.error("Error adding comment:", error);
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="bg-[#FAF9F6] border border-[#EDEAE4] rounded-[2rem] p-12 text-center space-y-4 animate-fade-in">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                    <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-widest">Avis Envoyé !</h3>
                <p className="text-[#8E8E8E] text-sm font-light">Merci pour votre retour. Votre avis sera visible sur notre page d'accueil sous peu.</p>
                <button 
                    onClick={() => setSuccess(false)}
                    className="text-[#C9A96E] text-[10px] font-black uppercase tracking-[0.2em] pt-4"
                >
                    Laisser un autre avis
                </button>
            </div>
        );
    }

    return (
        <div className="bg-transparent overflow-hidden">
            <div className="py-8">
                <div className="flex items-start gap-4 mb-10">
                    <div className="text-[#C9A96E] pt-1">
                        <MessageSquare size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold tracking-tight uppercase leading-none">Laissez votre empreinte</h3>
                        <p className="text-[9px] font-medium text-gray-400 uppercase tracking-[0.3em] mt-2">Votre avis sublime notre collection</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Rating Selection */}
                    <div className="space-y-4">
                        <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">Note d'expérience</label>
                        <div className="flex gap-1.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className="transition-all hover:scale-110 active:scale-95"
                                >
                                    <Star 
                                        size={22} 
                                        ={star <= rating ? "#C9A96E" : "none"} 
                                        stroke={star <= rating ? "#C9A96E" : "#E8E5E0"} 
                                        strokeWidth={1}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <div className="relative group">
                            <label className="absolute -top-2.5 left-4 bg-white px-2 text-[8px] font-bold uppercase tracking-[0.2em] text-gray-400 z-10">Votre Nom</label>
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="SOPHIE M."
                                className="w-full bg-white border border-gray-100 rounded-xl px-6 py-4 text-[11px] font-medium uppercase tracking-widest text-[#1A1A1A] focus:outline-none focus:border-[#C9A96E] focus:ring-1 focus:ring-[#C9A96E]/10 transition-all placeholder:text-gray-200"
                                required
                            />
                        </div>

                        <div className="relative group">
                            <label className="absolute -top-2.5 left-4 bg-white px-2 text-[8px] font-bold uppercase tracking-[0.2em] text-gray-400 z-10">Votre Commentaire</label>
                            <textarea 
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="PARTAGEZ VOTRE RESSENTI ICI..."
                                rows={4}
                                className="w-full bg-white border border-gray-100 rounded-xl px-6 py-4 text-[11px] font-medium text-[#1A1A1A] focus:outline-none focus:border-[#C9A96E] focus:ring-1 focus:ring-[#C9A96E]/10 transition-all placeholder:text-gray-200 resize-none"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-black text-white py-5 rounded-xl flex items-center justify-center gap-3 transition-all duration-500 hover:bg-[#C9A96E] group disabled:opacity-50 shadow-lg shadow-black/5"
                    >
                        {submitting ? (
                          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Envoi en cours</span>
                        ) : (
                          <>
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Publier l'avis</span>
                            <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform opacity-70" />
                          </>
                        )}
                    </button>
                    
                    <p className="text-[8px] text-center text-gray-300 font-medium uppercase tracking-widest">
                        Confidentialité garantie • Bazaar Style
                    </p>
                </form>
            </div>
        </div>
    );
}
