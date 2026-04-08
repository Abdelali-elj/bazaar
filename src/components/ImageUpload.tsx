"use client";
import React, { useState, useRef } from "react";
import { Image as ImageIcon, Upload, X, Loader2 } from "lucide-react";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  currentImageUrl?: string;
  label?: string;
}

export default function ImageUpload({ onUpload, currentImageUrl, label = "Visuel" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(50); // Simulate progress since fetch doesn't have native upload progress easily

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur serveur");
      }

      const data = await res.json();
      onUpload(data.url);
      setProgress(100);
    } catch (error: any) {
      console.error("Upload error:", error);
      alert(`Erreur lors de l'envoi de l'image: ${error.message || "Erreur inconnue"}`);
    } finally {
      setUploading(false);
      setProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggerInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
      
      <div 
        onClick={triggerInput}
        className={`relative group cursor-pointer border-2 border-dashed rounded-[2rem] transition-all duration-300 overflow-hidden flex flex-col items-center justify-center min-h-[160px] ${
          currentImageUrl ? "border-slate-100 bg-white" : "border-slate-200 bg-slate-50 hover:border-primary/30 hover:bg-white"
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/*"
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300">
            <div className="relative w-12 h-12 flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={32} />
                <span className="absolute text-[8px] font-black">{Math.round(progress)}%</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Envoi en cours...</p>
          </div>
        ) : currentImageUrl ? (
          <div className="relative w-full h-full group/preview animate-in zoom-in-95 duration-500">
             <img src={currentImageUrl} alt="Preview" className="w-full h-[160px] object-cover group-hover:opacity-75 transition-opacity" />
             <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-opacity bg-black/20">
                <div className="bg-white px-4 py-2 rounded-full flex items-center gap-2 shadow-2xl">
                    <Upload size={14} className="text-primary" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-900">Remplacer</span>
                </div>
             </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 group-hover:scale-105 transition-transform duration-500 py-8">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center text-slate-300 group-hover:text-primary transition-colors">
              <Upload size={24} />
            </div>
            <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Cliquez pour ajouter</p>
                <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400 mt-1">PNG, JPG ou WEBP max. 5MB</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
