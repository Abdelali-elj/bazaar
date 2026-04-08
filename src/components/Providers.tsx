"use client";
import { Plus_Jakarta_Sans, Cormorant_Garamond, Jost } from "next/font/google";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import CartDrawer from "@/components/CartDrawer";
import FavoritesDrawer from "@/components/FavoritesDrawer";
import BottomNav from "@/components/BottomNav";
import { FirebaseAuthProvider } from "@/context/FirebaseAuthContext";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { ActiveOfferProvider } from "@/components/ActiveOfferContext";
import { NotificationProvider } from "@/components/NotificationContext";

const jakarta = Plus_Jakarta_Sans({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800"],
    variable: "--font-outfit",
});

const playfair = Cormorant_Garamond({
    subsets: ["latin"],
    weight: ["300", "400", "600", "700"],
    style: ["normal", "italic"],
    variable: "--font-playfair",
});

const jost = Jost({
    subsets: ["latin"],
    weight: ["300", "400", "600", "700"],
    variable: "--font-jost",
});

export default function Providers({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isDashboard = pathname?.startsWith("/dashboard");

    return (
        <FirebaseAuthProvider>
        <NotificationProvider>
        <FavoritesProvider>
            <ActiveOfferProvider>
                <CartProvider>
                    <div className={`${jakarta.variable} ${playfair.variable} ${jost.variable} font-outfit antialiased selection:bg-slate-900/10 selection:text-slate-900 pb-20 md:pb-0`}>
                    {!isDashboard && <Header />}
                    <div className="min-h-screen">
                        {children}
                    </div>
                    {!isDashboard && <Footer />}
                    {!isDashboard && <CartDrawer />}
                    {!isDashboard && <FavoritesDrawer />}
                    {!isDashboard && <BottomNav />}
                    {!isDashboard && <WhatsAppButton />}
                </div>
                </CartProvider>
            </ActiveOfferProvider>
        </FavoritesProvider>
        </NotificationProvider>
        </FirebaseAuthProvider>
    );
}
