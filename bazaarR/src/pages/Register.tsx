import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "@/lib/actions/auth";
import { User, Mail, Lock, ChevronRight } from "lucide-react";

export default function Register() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const formData = new FormData(e.currentTarget);
      const result = await signUp(formData);
      
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else if (result?.success) {
        navigate("/");
        window.location.reload();
      }
    } catch (err: any) {
      setError("Une erreur inattendue s'est produite. Veuillez réessayer.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative flex flex-col items-center pt-32 pb-12 bg-black overflow-y-auto px-4 md:px-0">
      <div className="absolute inset-0 z-0 opacity-70">
        <img src="/bg1.webp" alt="Background" className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-black/40 z-0" />
      
      <div className="w-full max-w-[1140px] relative z-10 flex flex-col md:flex-row bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden animate-fade-up">
        <div className="w-full md:w-[50%] relative min-h-[250px] md:min-h-[520px]">
          <img src="/sign.webp" alt="Sign Up" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-transparent" />
        </div>

        <div className="w-full md:w-[50%] bg-white p-8 md:p-10 lg:p-12 flex flex-col justify-center">
          <header className="mb-4 lg:mb-6">
            <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl text-black/90 mb-3 font-light tracking-tight leading-tight">Rejoindre le <span className="text-black/10 italic">Collectif</span></h1>
            <p className="text-black/30 text-[8px] md:text-[9px] font-bold uppercase tracking-[0.4em] leading-relaxed">Devenez membre de notre cercle de beauté professionnel.</p>
          </header>

          {error && (
            <div className="bg-rose-500/5 border border-rose-500/10 text-rose-600 text-[10px] font-bold uppercase tracking-widest px-6 py-2 rounded-2xl mb-4 flex items-center gap-3 animate-shake">
              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-2 lg:space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1 relative group">
                <label className="block text-[7px] md:text-[8px] font-black text-black/10 uppercase tracking-[0.3em] ml-2">Prénom</label>
                <div className="relative">
                  <input 
                    name="first_name"
                    type="text" 
                    placeholder="Yassine"
                    required 
                    className="w-full bg-black/[0.02] border border-black/[0.05] rounded-3xl py-2.5 md:py-3 pl-10 pr-4 text-[12px] md:text-[13px] focus:outline-none focus:border-black/10 transition-all text-black font-light placeholder:text-black/10"
                  />
                  <User size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/10 group-focus-within:text-black/40 transition-colors" />
                </div>
              </div>
              <div className="space-y-1 relative group">
                <label className="block text-[7px] md:text-[8px] font-black text-black/10 uppercase tracking-[0.3em] ml-2">Nom</label>
                <div className="relative">
                  <input 
                    name="last_name"
                    type="text" 
                    placeholder="Alami"
                    required 
                    className="w-full bg-black/[0.02] border border-black/[0.05] rounded-3xl py-2.5 md:py-3 pl-10 pr-4 text-[12px] md:text-[13px] focus:outline-none focus:border-black/10 transition-all text-black font-light placeholder:text-black/10"
                  />
                  <User size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/10 group-focus-within:text-black/40 transition-colors" />
                </div>
              </div>
            </div>

            <div className="space-y-1 relative group">
              <label className="block text-[7px] md:text-[8px] font-black text-black/10 uppercase tracking-[0.3em] ml-2">Identité Email</label>
              <div className="relative">
                <input 
                  name="email"
                  type="email" 
                  placeholder="identity@collective.ma"
                  required 
                  className="w-full bg-black/[0.02] border border-black/[0.05] rounded-3xl py-3 md:py-3.5 pl-12 pr-6 text-[12px] md:text-[13px] focus:outline-none focus:border-black/10 transition-all text-black font-light placeholder:text-black/10"
                />
                <Mail size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-black/10 group-focus-within:text-black/40 transition-colors" />
              </div>
            </div>

            <div className="space-y-1 relative group">
              <label className="block text-[7px] md:text-[8px] font-black text-black/10 uppercase tracking-[0.3em] ml-2">Séquence Secrète</label>
              <div className="relative">
                <input 
                  name="password"
                  type="password" 
                  placeholder="••••••••"
                  required 
                  minLength={6}
                  className="w-full bg-black/[0.02] border border-black/[0.05] rounded-3xl py-3 md:py-3.5 pl-12 pr-6 text-[12px] md:text-[13px] focus:outline-none focus:border-black/10 transition-all text-black font-light placeholder:text-black/10 tracking-widest"
                />
                <Lock size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-black/10 group-focus-within:text-black/40 transition-colors" />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#AF8E5C] text-white py-3.5 rounded-3xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:bg-[#967a4e] transition-all shadow-xl shadow-[#AF8E5C]/10 disabled:opacity-50 group mt-2 overflow-hidden relative"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>CRÉER MON ACCÈS PRIVÉ <ChevronRight size={13} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between border-t border-black/5 pt-6">
            <Link to="/" className="text-[8px] md:text-[9px] font-bold text-black/10 hover:text-black uppercase tracking-[0.4em] transition-all">
               Retour à la boutique
            </Link>
            <div className="text-[9px] md:text-[10px] font-bold text-black/30 uppercase tracking-[0.2em]">
              Déjà membre ?{" "}
              <Link to="/auth/login" className="text-[#AF8E5C] hover:text-[#967a4e] transition-all ml-1 border-b-2 border-[#AF8E5C]/20 pb-0.5">
                Connexion
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
