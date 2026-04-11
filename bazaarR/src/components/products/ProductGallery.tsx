
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface ProductGalleryProps {
    images: string[];
    title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
    const [activeImage, setActiveImage] = useState(0);
    const galleryImages = images?.length > 0 ? images : ["https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=600"];

    const nextImage = () => setActiveImage((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
    const prevImage = () => setActiveImage((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));

    return (
        <div className="space-y-4">
            <div className="relative group max-w-[400px] mx-auto">
                <div className="absolute -inset-2 bg-[#C9A96E]/5 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-white shadow-2xl border border-[#F2EBE1]">
                    <img 
                        src={galleryImages[activeImage]} 
                        alt={title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 animate-in fade-in duration-500" 
                    />
                    
                    {/* Navigation Arrows */}
                    {galleryImages.length > 1 && (
                        <>
                            <button 
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-[#1A2E28] flex items-center justify-center hover:bg-white transition-all duration-300 z-10 opacity-0 group-hover:opacity-100"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button 
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-[#1A2E28] flex items-center justify-center hover:bg-white transition-all duration-300 z-10 opacity-0 group-hover:opacity-100"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </>
                    )}

                    <div className="absolute top-6 left-6">
                        <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm border border-white/20">
                            <Sparkles size={10} className="text-[#C9A96E]" />
                            <span className="text-[9px] font-black text-[#1A2E28] uppercase tracking-[0.2em]">Exclusivité</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Thumbnail Grid - Interactive */}
            {galleryImages.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                    {galleryImages.map((img: string, i: number) => (
                        <button 
                            key={i} 
                            onClick={() => setActiveImage(i)}
                            className={`aspect-square rounded-xl overflow-hidden border transition-all cursor-pointer bg-white ${
                                activeImage === i ? 'border-[#C9A96E] ring-2 ring-[#C9A96E]/10' : 'border-[#F2EBE1] hover:border-[#C9A96E]/50'
                            }`}
                        >
                            <img src={img} alt={`${title} ${i}`} className={`w-full h-full object-cover transition-opacity ${activeImage === i ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`} />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
