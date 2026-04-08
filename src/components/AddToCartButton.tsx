"use client";
import { useCart, CartItem } from "@/components/CartContext";

export default function AddToCartButton({
    product,
    variant = "icon",
    className = ""
}: {
    product: any;
    variant?: "icon" | "full";
    className?: string;
}) {
    const { addItem } = useCart();

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const cartItem: CartItem = {
            id: product.id,
            title: product.title,
            price: product.price,
            quantity: 1,
            image: product.image_url || null,
        };

        addItem(cartItem);
    };

    if (variant === "full") {
        return (
            <button
                onClick={handleAdd}
                className={`flex-1 py-4 px-8 rounded-full bg-slate-900 text-white font-black text-center text-xs uppercase tracking-widest shadow-2xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer ${className}`}
            >
                Ajouter au Panier
            </button>
        );
    }

    return (
        <button
            onClick={handleAdd}
            className={`w-12 h-12 rounded-2xl bg-sky-50 text-sky-500 hover:bg-sky-500 hover:text-white hover:scale-110 transition-all flex items-center justify-center shadow-lg shadow-sky-100/10 ${className}`}
        >
            <span className="text-lg">＋</span>
        </button>
    );
}
