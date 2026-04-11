import { useLocation } from "react-router-dom";
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

export default function Providers({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const pathname = location.pathname;
    const isDashboard = pathname?.startsWith("/dashboard");

    return (
        <FirebaseAuthProvider>
        <NotificationProvider>
        <FavoritesProvider>
            <ActiveOfferProvider>
                <CartProvider>
                    <div className="font-outfit antialiased selection:bg-slate-900/10 selection:text-slate-900 pb-20 md:pb-0">
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

