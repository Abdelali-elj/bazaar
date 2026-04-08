import { getCategories } from "@/lib/actions/categories";
import Link from "next/link";

export default async function CategoriesPage() {
  const categoriesRaw = await getCategories().catch(() => []);
  const categories = categoriesRaw.filter((c: any) => c.name);

  return (
    <main className="min-h-screen pt-40 pb-32 bg-white">
      <div className="container-wide px-6">
        {/* Editorial Header */}
        <div className="max-w-4xl mx-auto text-center mb-32 space-y-6 animate-fade-up">
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="w-12 h-px bg-slate-900/10" />
            <span className="text-slate-900 text-[10px] font-black uppercase tracking-[0.4em] whitespace-nowrap">
              L'Art de Vivre
            </span>
            <div className="w-12 h-px bg-slate-900/10" />
          </div>
          <h1 className="text-5xl md:text-8xl font-playfair italic text-slate-900 leading-[1.1] font-light">
            Nos Univers <br />
            <span className="text-primary">Atelier</span>
          </h1>
          <p className="text-slate-400 font-medium max-w-xl mx-auto text-sm md:text-base leading-relaxed tracking-wide">
            Découvrez nos collections méticuleusement sélectionnées pour magnifier votre quotidien.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {categories.map((cat: any, index: number) => (
            <Link 
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group relative flex flex-col animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Category Visual */}
              <div className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden bg-slate-50 shadow-sm group-hover:shadow-2xl group-hover:shadow-slate-200 transition-all duration-700">
                <div className="absolute inset-0 bg-slate-100 flex items-center justify-center transition-transform duration-1000 group-hover:scale-110">
                  {cat.image_url ? (
                    <img 
                       src={cat.image_url} 
                       alt={cat.name} 
                       className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700" 
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-4 opacity-20">
                      <span className="text-[12vw] font-playfair italic text-slate-900 select-none">
                        {cat.name[0]}
                      </span>
                    </div>
                  )}
                </div>

                {/* Glassmorphism Bottom Card */}
                <div className="absolute inset-x-4 bottom-4 p-8 rounded-[1.5rem] bg-white/80 backdrop-blur-xl border border-white transition-all duration-500 group-hover:bg-slate-900 group-hover:border-slate-800">
                    <div className="space-y-2">
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary group-hover:text-white/60 transition-colors">Explorer</span>
                        <h2 className="text-2xl font-playfair italic text-slate-900 group-hover:text-white transition-colors">
                          {cat.name}
                        </h2>
                    </div>
                    
                    <div className="mt-6 flex items-center justify-between opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                        <span className="text-[10px] text-white/40 uppercase tracking-widest font-black">Voir la collection</span>
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        </div>
                    </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="py-60 text-center space-y-8 animate-fade-in opacity-40">
            <div className="text-slate-200 font-playfair italic text-6xl">À venir...</div>
            <p className="text-slate-400 font-medium tracking-[0.2em] uppercase text-[10px]">Nous préparons vos prochaines inspirations.</p>
          </div>
        )}
      </div>
    </main>
  );
}
