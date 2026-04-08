"use client";
import { use, useState, useEffect } from "react";
import Recommendations from "@/components/products/Recommendations";
import { getProductBySlug } from "@/lib/actions/products";
import { notFound } from "next/navigation";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import { HeartIcon } from "@/components/icons";
import { Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProductDetailsPage({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
  const params = use(paramsPromise);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (!params.slug) return;
    
    getProductBySlug(params.slug).then(res => {
      if (res) {
        setProduct(res);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [params.slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black animate-pulse text-primary lowercase tracking-widest">En Attente d'Éclat...</div>;
  if (!product) notFound();

  return (
    <main className="min-h-screen pt-24 md:pt-40 pb-20 md:pb-32 bg-white">
      <div className="container-wide px-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-3 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20 mb-8 md:mb-16 animate-fade-up">
          <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
          <span className="opacity-20">•</span>
          <span className="text-foreground/40 truncate max-w-[150px]">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 lg:gap-40 items-start">
          {/* Images Section */}
          <div className="animate-fade-up">
            <div className="relative aspect-[4/5] bg-pink-50/20 rounded-[2rem] md:rounded-[4rem] overflow-hidden ring-1 ring-pink-50 shadow-2xl shadow-pink-100/20">
                <img src={product.images?.[activeImage] || product.image_url || "https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=300"} alt={product.title} className="w-full h-full object-cover transition-all duration-700" />
                <div className="absolute top-4 md:top-8 right-4 md:right-8">
                   <button className="w-10 md:w-14 h-10 md:h-14 rounded-full bg-white/80 backdrop-blur text-foreground flex items-center justify-center shadow-xl hover:text-primary transition-all">
                      <HeartIcon className="w-5 h-5 md:w-6 md:h-6" />
                   </button>
                </div>
            </div>
            
            {product.images && product.images.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mt-8">
                {product.images.slice(0, 8).map((imgUrl: string, i: number) => (
                  <div 
                    key={i} 
                    onClick={() => setActiveImage(i)}
                    className={`aspect-square bg-pink-50/10 rounded-[1.5rem] overflow-hidden border transition-all cursor-pointer group ${activeImage === i ? 'border-primary ring-2 ring-primary/10' : 'border-pink-50/50 hover:border-primary/50'}`}
                  >
                    <img 
                      src={imgUrl} 
                      alt={`Gallery ${i}`} 
                      className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${activeImage === i ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`} 
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="flex flex-col animate-fade-up delay-100">
            <div className="mb-8 md:mb-12">
              <h1 className="text-3xl md:text-6xl font-black tracking-tighter leading-[1.1] md:leading-[1.05] mb-6 md:mb-8 text-foreground">
                {product.title}
              </h1>
              <div className="text-3xl md:text-4xl font-black text-primary tracking-tighter">
                {parseFloat(product.price).toFixed(2)} DH
              </div>
            </div>

            {/* Compact Description Inline */}
            <div className="border-t border-pink-50 pt-6 md:pt-8 mb-8 md:mb-12">
              {product.description ? (
                <div 
                  className="text-[15px] md:text-lg text-foreground/50 font-medium leading-relaxed italic [&>p]:mb-4 [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mb-4 [&>li]:mb-2 [&_img]:hidden"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              ) : (
                <p className="text-[15px] md:text-lg text-foreground/50 font-medium leading-relaxed italic">
                  Une expérience de luxe conçue pour des résultats radieux et durables. Notre mélange exclusif combine des extraits botaniques avec des bio-actifs de haute performance.
                </p>
              )}
            </div>

            <div className="space-y-12 mb-20">
              <div className="flex flex-col sm:flex-row items-stretch gap-4 border-t border-pink-50 pt-12">
                <button 
                  onClick={() => router.push(`/fastshop/${product.id}?qty=1`)}
                  className="w-full py-5 bg-[#1A2E28] text-white font-black uppercase tracking-widest text-[11px] rounded-full shadow-xl shadow-[#1A2E28]/20 hover:scale-[1.02] hover:bg-[#C9A96E] transition-all flex items-center justify-center gap-3 order-1 sm:order-2"
                >
                  <Zap size={16} className="text-[#C9A96E] group-hover:text-white transition-colors" />
                  Acheter Directement
                </button>
                <AddToCartButton 
                  product={product} 
                  className="!w-full !py-5 !bg-white !text-[#1A2E28] !border-2 !border-[#E8E3DB] !font-black !uppercase !tracking-widest !text-[11px] !rounded-full !hover:border-[#1A2E28] !hover:bg-slate-50 !transition-all order-2 sm:order-1"
                />
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex justify-between items-center bg-white border border-pink-50 rounded-full py-3 md:py-4 px-6 md:px-10">
               <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-foreground/20">Paiements Sécurisés</span>
               <div className="flex gap-3 md:gap-4 opacity-20 font-black text-[9px] md:text-[10px]">
                  <span>VISA</span>
                  <span>AMEX</span>
                  <span>PAYPAL</span>
               </div>
            </div>
          </div>
        </div>

        <Recommendations currentProductId={product?.id} />
      </div>
    </main>
  );
}
