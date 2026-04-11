
import React from 'react';
import { useNavigate as useRouter } from "react-router-dom";
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
    className?: string;
    fallback?: string;
}

export default function BackButton({ className, fallback = "/products" }: BackButtonProps) {
    const router = useRouter();

    const handleBack = () => {
        // Checking if there's history, otherwise go to fallback
        if (window.history.length > 2) {
            router.back();
        } else {
            router(fallback);
        }
    };

    return (
        <button 
            onClick={handleBack}
            className={className || "group inline-flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#1A2E28] transition-all"}
        >
            <div className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-[#1A2E28]">
                <ArrowLeft size={10} />
            </div>
            Retour
        </button>
    );
}
