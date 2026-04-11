import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signIn } from "@/lib/actions/auth";
import { Mail, Lock, ChevronRight } from "lucide-react";

export default function Login() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const formData = new FormData(e.currentTarget);
      const result = await signIn(formData);
      
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else {
        // Rediriger vers l'accueil
        navigate("/");
        window.location.reload(); // Force reload to refresh auth state if needed
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative flex flex-col items-center pt-32 pb-12 bg-black overflow-y-auto px-4 md:px-0">
      <div className="absolute inset-0 z-0 opacity-80">
        <img src="/bg1.webp" alt="Background" className="w-full h-full object-cover hidden md:block" />
        <img src="/bg2.webp" alt="Background Mobile" className="w-full h-full object-cover md:hidden" />
      </div>
      <div className="absolute inset-0 bg-black/40 z-0" />
      
      <div className="w-full max-w-[1140px] relative z-10 flex flex-col md:flex-row bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden animate-fade-up my-auto">
        <div className="w-full md:w-[50%] relative min-h-[250px] md:min-h-[520px]">
          <img src="/log.webp" alt="Sign In" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-transparent" />
        </div>

        <div className="w-full md:w-[50%] bg-white p-8 md:p-10 lg:p-14 flex flex-col justify-center">
          <header className="mb-4 md:mb-6">
             <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl text-black/90 mb-3 font-light tracking-tight leading-tight">Bienvenue <span className="text-black/10 italic">!</span></h1>
             <p className="text-black/30 text-[8px] md:text-[9px] font-bold uppercase tracking-[0.4em] leading-relaxed">Identifiez-vous pour accéder à votre espace.</p>
          </header>

          {error && (
            <div className="bg-rose-500/5 border border-rose-500/10 text-rose-600 text-[10px] font-bold uppercase tracking-widest px-6 py-2.5 rounded-2xl mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-5">
            <div className="space-y-1.5 relative group">
              <label className="block text-[8px] font-black text-black/10 uppercase tracking-[0.3em] ml-2">Identité Email</label>
              <div className="relative">
                <input 
                  name="email"
                  type="email" 
                  placeholder="@utilisateur"
                  required 
                  className="w-full bg-black/[0.02] border border-black/[0.05] rounded-3xl py-3.5 md:py-4 pl-12 pr-7 text-[12px] md:text-[13px] focus:outline-none focus:border-black/10 transition-all text-black font-light placeholder:text-black/20"
                />
                <Mail size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-black/10 group-focus-within:text-black/40 transition-colors" />
              </div>
            </div>

            <div className="space-y-1.5 relative group">
              <div className="flex justify-between items-center ml-2">
                <label className="block text-[8px] font-black text-black/10 uppercase tracking-[0.3em]">Clé Privée</label>
                <Link to="#" className="text-[7px] md:text-[8px] font-bold text-black/20 hover:text-black uppercase tracking-widest transition-colors">Oublié ?</Link>
              </div>
              <div className="relative">
                <input 
                  name="password"
                  type="password" 
                  placeholder="Mot de passe"
                  required 
                  className="w-full bg-black/[0.02] border border-black/[0.05] rounded-3xl py-3.5 md:py-4 pl-12 pr-7 text-[12px] md:text-[13px] focus:outline-none focus:border-black/10 transition-all text-black font-light placeholder:text-black/20"
                />
                <Lock size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-black/10 group-focus-within:text-black/40 transition-colors" />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#AF8E5C] text-white py-3.5 md:py-4 rounded-3xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.5em] flex items-center justify-center gap-3 hover:bg-[#967a4e] transition-all shadow-xl shadow-[#AF8E5C]/10 disabled:opacity-50 group overflow-hidden relative"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>AUTHENTIFICATION <ChevronRight size={13} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between border-t border-black/5 pt-6">
            <Link to="/" className="text-[8px] md:text-[9px] font-bold text-black/10 hover:text-black uppercase tracking-[0.4em] transition-all font-sans">
               Retour à l'accueil
            </Link>
            <div className="text-[9px] md:text-[10px] font-bold text-black/30 uppercase tracking-[0.2em]">
              Nouveau membre ?{" "}
              <Link to="/auth/register" className="text-[#AF8E5C] hover:text-[#967a4e] transition-all ml-1 border-b-2 border-[#AF8E5C]/20 pb-0.5">
                Rejoindre
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
