import { getProductById } from "@/lib/actions/products";
import FastBuyForm from "@/components/products/FastBuyForm";
import { notFound } from "next/navigation";
import { ShieldCheck, Zap, Truck, Star, Sparkles } from "lucide-react";
import ProductGallery from "@/components/products/ProductGallery";
import BackButton from "@/components/ui/BackButton";

export default async function FastShopPage(props: { 
    params: Promise<{ id: string }>, 
    searchParams: Promise<{ qty?: string }> 
}) {
    const params = await props.params;
    const searchParams = await props.searchParams;
    const product = await getProductById(params.id);
    if (!product) return notFound();
    
    // Default to 1 if NaN
    const qty = parseInt(searchParams.qty || '1', 10) || 1;

    return (
        <main className="min-h-screen bg-[#FDFCFB] pt-20 pb-10">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                
                {/* Back Link */}
                <div className="mb-4">
                    <BackButton fallback="/products" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    
                    {/* LEFT COLUMN: PRODUCT GALLERY */}
                    <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
                        <ProductGallery images={product.images} title={product.title} />

                        {/* Trust Badges Desktop Compact */}
                        <div className="hidden lg:grid grid-cols-3 gap-4 pt-8 border-t border-[#F2EBE1]">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#1A2E28]/5 flex items-center justify-center text-[#1A2E28]">
                                    <Truck size={14} />
                                </div>
                                <span className="text-[8px] font-black uppercase tracking-widest text-[#1A2E28]">Livraison 48H</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#1A2E28]/5 flex items-center justify-center text-[#1A2E28]">
                                    <ShieldCheck size={14} />
                                </div>
                                <span className="text-[8px] font-black uppercase tracking-widest text-[#1A2E28]">100% Original</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#1A2E28]/5 flex items-center justify-center text-[#1A2E28]">
                                    <Zap size={14} />
                                </div>
                                <span className="text-[8px] font-black uppercase tracking-widest text-[#1A2E28]">Paiement Cash</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: DETAILS & FORM */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        
                        {/* THE NEW PRICE/RATING CARD */}
                        <div className="bg-white rounded-3xl border border-[#F2EBE1] shadow-xl p-6 flex items-center justify-between">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex items-center gap-1 text-[#C9A96E]">
                                        {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} fill="currentColor" />)}
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">5.0 (48 Avis)</span>
                                </div>
                                <h1 className="text-2xl lg:text-3xl font-black text-[#1A2E28] tracking-tighter uppercase leading-none">
                                    {product.title}
                                </h1>
                            </div>
                            <div className="text-right border-l border-slate-100 pl-8">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-[#C9A96E] uppercase tracking-widest mb-1">Prix Promo</span>
                                    <span className="text-4xl font-black text-[#1A2E28] leading-none">{product.price.toLocaleString()} <span className="text-xs">DH</span></span>
                                    <span className="text-[11px] text-slate-300 line-through font-medium mt-1">{(product.price * 1.25).toLocaleString()} DH</span>
                                </div>
                            </div>
                        </div>

                        {/* Integrated Fast Buy Form */}
                        <div className="relative">
                            <div className="bg-white rounded-[2.5rem] border border-[#F2EBE1] shadow-2xl shadow-slate-200/50 p-2 overflow-hidden">
                                <FastBuyForm 
                                    product={product} 
                                    quantity={qty} 
                                    isFullScreen={true} 
                                    showProductSummary={false} 
                                />
                            </div>
                        </div>

                        {/* Mobile Trust Badges - Very Compact */}
                        <div className="grid lg:hidden grid-cols-2 gap-2 mt-2">
                             <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-[#F2EBE1]">
                                <Truck size={14} className="text-[#C9A96E]" />
                                <span className="text-[7px] font-black uppercase tracking-widest text-[#1A2E28]">Livraison 48H</span>
                             </div>
                             <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-[#F2EBE1]">
                                <Zap size={14} className="text-[#C9A96E]" />
                                <span className="text-[7px] font-black uppercase tracking-widest text-[#1A2E28]">Paiement Cash</span>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
