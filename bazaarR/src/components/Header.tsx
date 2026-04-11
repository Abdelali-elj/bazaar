import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingBag, Heart, User, Menu, X, ChevronDown, Search, MapPin } from "lucide-react";
import { useCart } from "./CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useState, useEffect, useRef } from "react";
import { getCategories } from "@/lib/actions/categories";
import { getUser, signOut } from "@/lib/actions/auth";
import SearchOverlay from "./SearchOverlay";

export default function Header() {
    const location = useLocation();
    const pathname = location.pathname;
    const navigate = useNavigate();

    const { totalItems, setIsCartOpen } = useCart();
    const { favorites, setIsFavoritesOpen } = useFavorites();
    const [categories, setCategories] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileCatOpen, setIsMobileCatOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScrollEvent = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScrollEvent);
        handleScrollEvent();
        return () => window.removeEventListener('scroll', handleScrollEvent);
    }, []);

    useEffect(() => {
        getCategories().then(setCategories).catch(console.error);
    }, []);

    // Re-fetch user when pathname changes or profile is updated
    useEffect(() => {
        const fetchUser = () => getUser().then(setUser).catch(console.error);
        fetchUser();

        window.addEventListener('profileUpdated', fetchUser);
        return () => window.removeEventListener('profileUpdated', fetchUser);
    }, [pathname]);

    const handleSignOut = async () => {
        setUser(null);
        await signOut();
        window.location.href = '/';
    };

    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
        if (pathname === '/') {
            e.preventDefault();
            const element = document.getElementById(targetId);
            if (element) {
                const headerOffset = 100;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
            setIsMobileMenuOpen(false);
        }
    };

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsMobileMenuOpen(false);
            }
        };
        if (isMobileMenuOpen) document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [isMobileMenuOpen]);

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        if (isProfileOpen) document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [isProfileOpen]);

    const isWhite = true; // Forced white for premium consistent look

    const navLinkClass = `nav-link whitespace-nowrap text-[11px] xl:text-[12px] uppercase tracking-[0.2em] font-medium transition-colors ${isWhite ? 'text-black/70 hover:text-black' : 'text-white/70 hover:text-white'
        }`;

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 pt-4 md:pt-6 px-4 xl:px-8 transition-all duration-300">
                <div className={`flex items-center justify-between w-full max-w-[90rem] mx-auto rounded-full h-14 md:h-16 px-6 lg:px-8 transition-all duration-300 ${isWhite
                        ? 'bg-white border border-black/5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]'
                        : 'bg-white/[0.02] backdrop-blur-[12px] border border-white/5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)]'
                    }`}>

                    {/* LOGO */}
                    <div className="shrink-0 flex items-center justify-center">
                        <Link 
                            to="/" 
                            onClick={(e) => {
                                if (window.location.pathname === '/') {
                                    e.preventDefault();
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                    window.dispatchEvent(new CustomEvent('refreshHome'));
                                }
                            }}
                            className="flex items-center"
                        >
                            <img 
                                src="/logo.webp" 
                                alt="BAZAAR Style Logo" 
                                className={`h-8 md:h-10 w-auto object-contain transition-all duration-300 ${isWhite ? 'brightness-100' : 'brightness-0 invert'}`}
                            />
                        </Link>
                    </div>

                    {/* CENTER NAV — Desktop/Laptop only */}
                    <nav className="hidden lg:flex items-center gap-8 xl:gap-10 h-full">
                        <Link
                            to="/#home"
                            onClick={(e) => handleScroll(e, 'home')}
                            className={`nav-link whitespace-nowrap text-[11px] xl:text-[12px] uppercase tracking-[0.2em] font-medium transition-colors ${isWhite ? 'text-black/70 hover:text-black' : 'text-white/70 hover:text-white'}`}
                        >ACCUEIL</Link>

                        {/* CATEGORIE Dropdown */}
                        <div
                            className="relative group h-full flex items-center"
                            onMouseEnter={() => setIsDropdownOpen(true)}
                            onMouseLeave={() => setIsDropdownOpen(false)}
                        >
                            <div
                                className={`nav-link whitespace-nowrap flex items-center gap-2 text-[11px] xl:text-[12px] uppercase tracking-[0.2em] font-medium transition-colors cursor-default ${isWhite ? 'text-black/70 hover:text-black' : 'text-white/70 hover:text-white'}`}
                            >
                                CATÉGORIES
                                <ChevronDown size={12} className={`transition-transform duration-300 opacity-40 group-hover:opacity-100 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </div>

                            <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-300 z-[100] ${isDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                                <div className="rounded-3xl p-6 min-w-[280px] grid grid-cols-1 gap-2 shadow-2xl border border-white/10 bg-black/90 backdrop-blur-3xl">
                                    <div className="px-4 pb-4 mb-2 border-b border-white/5">
                                        <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em]">Nos Collections</p>
                                    </div>
                                    {categories.length > 0 ? (
                                        <div className="max-h-[350px] overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-1">
                                            {categories.filter(c => c.name).map((cat) => (
                                                <Link key={cat.id} to={`/products?category=${cat.id}`}
                                                    onClick={() => setIsDropdownOpen(false)}
                                                    className="group flex items-center justify-between text-white/60 hover:text-white text-[10px] uppercase tracking-widest px-4 py-3.5 rounded-2xl hover:bg-white/5 transition-all"
                                                >
                                                    <span className="font-bold">{cat.name}</span>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-white/40 text-[9px] uppercase tracking-widest text-center py-4">Chargement...</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Link
                            to="/allproduct"
                            className={`nav-link whitespace-nowrap text-[11px] xl:text-[12px] uppercase tracking-[0.2em] font-medium transition-colors ${isWhite ? 'text-black/70 hover:text-black' : 'text-white/70 hover:text-white'}`}
                        >BOUTIQUE</Link>
                        <Link
                            to="/#footer"
                            onClick={(e) => handleScroll(e, 'footer')}
                            className={`nav-link whitespace-nowrap text-[11px] xl:text-[12px] uppercase tracking-[0.2em] font-medium transition-colors ${isWhite ? 'text-black/70 hover:text-black' : 'text-white/70 hover:text-white'}`}
                        >CONTACT</Link>
                        
                        <Link
                            to="/tracking"
                            className="hidden lg:flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-[#1A2E28] hover:bg-[#C9A96E] transition-all group lg:ml-4 xl:ml-6 shadow-lg shadow-black/5"
                        >
                            <MapPin size={15} className="text-white/80 group-hover:text-white transition-colors" />
                            <span className="hidden xl:inline text-[11px] xl:text-[12px] uppercase tracking-[0.2em] font-black text-white">Suivi</span>
                        </Link>
                    </nav>

                    {/* RIGHT SIDE */}
                    <div className="shrink-0 flex items-center justify-center gap-4 lg:gap-6">
                        {/* Desktop icons */}
                        <div className="hidden lg:flex items-center gap-5">
                            <button
                                className={`transition-colors flex items-center gap-2 group ${isWhite ? 'text-black/70 hover:text-black' : 'text-white/70 hover:text-white'}`}
                                onClick={() => setIsSearchOpen(true)}
                            >
                                <Search size={18} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                            </button>
                            <button className={`relative transition-colors ${isWhite ? 'text-black/70 hover:text-black' : 'text-white/70 hover:text-white'}`} onClick={() => setIsFavoritesOpen(true)}>
                                <Heart size={18} strokeWidth={1.5} />
                                {favorites.length > 0 && (
                                    <span className={`absolute -top-2 -right-2 text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full leading-none z-10 transition-colors ${isWhite ? 'bg-black text-white' : 'bg-white text-black'}`}>
                                        {favorites.length}
                                    </span>
                                )}
                            </button>
                            <button className={`relative transition-colors ${isWhite ? 'text-black/70 hover:text-black' : 'text-white/70 hover:text-white'}`} onClick={() => setIsCartOpen(true)}>
                                <ShoppingBag size={18} strokeWidth={1.5} />
                                {totalItems > 0 && (
                                    <span className={`absolute -top-2 -right-2 text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full leading-none z-10 transition-colors ${isWhite ? 'bg-black text-white' : 'bg-white text-black'}`}>
                                        {totalItems}
                                    </span>
                                )}
                            </button>
                        </div>
                        <div className={`hidden lg:block w-px h-5 transition-colors ${isWhite ? 'bg-black/15' : 'bg-white/15'}`} />
                        {/* User Profile / Login */}
                        <div className="hidden lg:flex items-center gap-2 relative" ref={profileRef}>
                            {user ? (
                                <div className="relative">
                                    <div
                                        className="flex items-center gap-3 cursor-pointer group"
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    >
                                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors overflow-hidden ${isWhite ? 'border-black/20 group-hover:border-black/40 bg-black/5' : 'border-white/20 group-hover:border-white/40 bg-white/5'}`}>
                                            {user.profile?.avatar_url ? (
                                                <img src={user.profile.avatar_url} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className={`text-[11px] font-bold transition-colors ${isWhite ? 'text-black/90' : 'text-white/90'}`}>{user.profile?.first_name?.[0] || <User size={14} />}</span>
                                            )}
                                        </div>
                                        <span className={`text-[11px] font-bold tracking-[0.1em] transition-colors uppercase ${isWhite ? 'text-black/90 group-hover:text-black' : 'text-white/90 group-hover:text-white'}`}>
                                            {user.profile?.first_name || 'PROFIL'}
                                        </span>
                                    </div>

                                    {/* Profile Dropdown */}
                                    <div className={`absolute top-full right-0 pt-4 transition-all duration-300 z-[100] ${isProfileOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                                        <div className="rounded-2xl p-2 min-w-[200px] flex flex-col gap-1 shadow-2xl border border-black/5 bg-white backdrop-blur-2xl">
                                            {['super_admin', 'owner', 'staff'].includes(user.profile?.role || '') ? (
                                                <Link to="/dashboard" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 text-black/70 hover:text-black text-[10px] uppercase tracking-widest px-4 py-3 rounded-xl hover:bg-black/5 transition-all text-left">
                                                    Tableau de bord
                                                </Link>
                                            ) : (
                                                <Link to="/dashboard/client" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 text-black/70 hover:text-black text-[10px] uppercase tracking-widest px-4 py-3 rounded-xl hover:bg-black/5 transition-all text-left">
                                                    Mon Espace
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => { setIsProfileOpen(false); handleSignOut(); }}
                                                className="flex items-center gap-3 text-rose-500 hover:text-rose-600 text-[10px] uppercase tracking-widest px-4 py-3 rounded-xl hover:bg-rose-50 transition-all text-left w-full font-bold"
                                            >
                                                Déconnexion
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Link to="/auth/login" className="flex items-center gap-2 group">
                                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${isWhite ? 'border-black/20 group-hover:border-black/40' : 'border-white/20 group-hover:border-white/40'}`}>
                                        <User size={14} strokeWidth={1} className={`transition-colors ${isWhite ? 'text-black/80' : 'text-white/80'}`} />
                                    </div>
                                    <span className={`text-[11px] font-bold tracking-[0.1em] transition-colors uppercase ${isWhite ? 'text-black/90 group-hover:text-black' : 'text-white/90 group-hover:text-white'}`}>CONNEXION</span>
                                </Link>
                            )}
                        </div>

                        {/* Mobile Actions */}
                        <div className="lg:hidden flex items-center justify-center gap-3 relative">
                            <Link
                                to="/tracking"
                                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all bg-[#1A2E28] text-white shadow-lg`}
                            >
                                <MapPin size={16} />
                            </Link>
                            <button
                                className={`transition-colors ${isWhite ? 'text-black/80 hover:text-black' : 'text-white/80 hover:text-white'}`}
                                onClick={() => setIsSearchOpen(true)}
                            >
                                <Search size={20} strokeWidth={1.5} />
                            </button>
                            <button className={`relative transition-colors ${isWhite ? 'text-black/80 hover:text-black' : 'text-white/80 hover:text-white'}`} onClick={() => setIsFavoritesOpen(true)}>
                                <Heart size={18} strokeWidth={1.5} />
                                {favorites.length > 0 && (
                                    <span className={`absolute -top-2 -right-2 text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full leading-none z-10 transition-colors ${isWhite ? 'bg-black text-white' : 'bg-white text-black'}`}>
                                        {favorites.length}
                                    </span>
                                )}
                            </button>
                            <button className={`relative transition-colors mr-1 ${isWhite ? 'text-black/80 hover:text-black' : 'text-white/80 hover:text-white'}`} onClick={() => setIsCartOpen(true)}>
                                <ShoppingBag size={18} strokeWidth={1.5} />
                                {totalItems > 0 && (
                                    <span className={`absolute -top-2 -right-2 text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full leading-none z-10 transition-colors ${isWhite ? 'bg-black text-white' : 'bg-white text-black'}`}>
                                        {totalItems}
                                    </span>
                                )}
                            </button>

                            {user ? (
                                <div className="relative" ref={profileRef}>
                                    <button
                                        className={`w-8 h-8 rounded-full border flex items-center justify-center active:scale-95 transition-all overflow-hidden ${isWhite ? 'border-black/20 bg-black/5' : 'border-white/20 bg-white/5'}`}
                                        onClick={() => { setIsProfileOpen(!isProfileOpen); setIsMobileMenuOpen(false); }}
                                    >
                                        {user.profile?.avatar_url ? (
                                            <img src={user.profile.avatar_url} className="w-full h-full object-cover rounded-full" />
                                        ) : (
                                            <span className={`text-[11px] font-bold transition-colors ${isWhite ? 'text-black/90' : 'text-white/90'}`}>{user.profile?.first_name?.[0] || <User size={14} />}</span>
                                        )}
                                    </button>

                                    {/* Mobile Profile Dropdown (Popup style) */}
                                    <div className={`absolute top-full right-0 mt-4 w-48 transition-all duration-200 z-[100] ${isProfileOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                                        <div className="bg-white border border-black/5 rounded-2xl overflow-hidden shadow-2xl p-1 flex flex-col gap-1">
                                            {['super_admin', 'owner', 'staff'].includes(user.profile?.role || '') ? (
                                                <Link to="/dashboard" onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center px-4 py-3 text-[10px] uppercase tracking-widest font-bold text-black/70 hover:text-black hover:bg-black/5 rounded-xl transition-all"
                                                >TABLEAU DE BORD</Link>
                                            ) : (
                                                <Link to="/dashboard/client" onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center px-4 py-3 text-[10px] uppercase tracking-widest font-bold text-black/70 hover:text-black hover:bg-black/5 rounded-xl transition-all"
                                                >MON ESPACE</Link>
                                            )}
                                            <button
                                                onClick={() => { setIsProfileOpen(false); handleSignOut(); }}
                                                className="flex items-center px-4 py-3 text-[10px] uppercase tracking-widest font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all text-left"
                                            >DÉCONNEXION</button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Link to="/auth/login" className="flex items-center justify-center">
                                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${isWhite ? 'border-black/20' : 'border-white/20'}`}>
                                        <User size={14} strokeWidth={1.5} className={`transition-colors ${isWhite ? 'text-black/80' : 'text-white/80'}`} />
                                    </div>
                                </Link>
                            )}

                            <div className={`w-px h-4 ml-1 mr-1 transition-colors ${isWhite ? 'bg-black/20' : 'bg-white/20'}`} />

                            <button
                                className={`transition-colors flex items-center justify-center ${isWhite ? 'text-black/80 hover:text-black' : 'text-white/80 hover:text-white'}`}
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {isMobileMenuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
                            </button>

                            {/* Compact Mobile Popup Menu */}
                            <div className={`absolute top-full right-0 mt-4 w-56 transition-all duration-200 ${isMobileMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`} ref={menuRef}>
                                <div className="bg-white border border-black/5 rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.2)]">

                                    {/* HOME */}
                                    <Link
                                        to="/#home"
                                        onClick={(e) => handleScroll(e, 'home')}
                                        className="flex items-center px-5 py-4 text-[10px] uppercase tracking-[0.3em] font-bold text-black/70 hover:text-black hover:bg-black/5 transition-all border-b border-black/5"
                                    >ACCUEIL</Link>

                                    {/* PRODUCT */}
                                    <Link
                                        to="/allproduct"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center px-5 py-4 text-[10px] uppercase tracking-[0.3em] font-bold text-black/70 hover:text-black hover:bg-black/5 transition-all border-b border-black/5"
                                    >BOUTIQUE</Link>

                                    {/* CATEGORIE — accordion */}
                                    <button
                                        onClick={() => setIsMobileCatOpen(!isMobileCatOpen)}
                                        className="w-full flex items-center justify-between px-5 py-4 text-[10px] uppercase tracking-[0.3em] font-bold text-black/70 hover:text-black hover:bg-black/5 transition-all border-b border-black/5"
                                    >
                                        <span>CATÉGORIES</span>
                                        <div className="flex items-center gap-2">
                                            {categories.length > 0 && (
                                                <span className="bg-black/5 text-black text-[8px] font-black px-1.5 py-0.5 rounded-full leading-none">{categories.length}</span>
                                            )}
                                            <ChevronDown size={12} className={`transition-transform duration-200 ${isMobileCatOpen ? 'rotate-180' : ''}`} />
                                        </div>
                                    </button>

                                    {/* Category sub-links */}
                                    {isMobileCatOpen && (
                                        <div className="bg-black/[0.02] border-b border-black/5">
                                            {categories.map((cat) => (
                                                <Link
                                                    key={cat.id}
                                                    to={`/products?category=${cat.id}`}
                                                    onClick={() => { setIsMobileMenuOpen(false); setIsMobileCatOpen(false); }}
                                                    className="flex items-center gap-2 px-6 py-3 text-[9px] uppercase tracking-[0.2em] font-bold text-black/60 hover:text-black hover:bg-black/5 transition-all"
                                                >
                                                    <span className="w-2 h-px bg-black/10 flex-shrink-0" />
                                                    {cat.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}

                                    {/* CONTACT */}
                                    <Link
                                        to="/#footer"
                                        onClick={(e) => handleScroll(e, 'footer')}
                                        className="flex items-center px-5 py-4 text-[10px] uppercase tracking-[0.3em] font-bold text-black/70 hover:text-black hover:bg-black/5 transition-all"
                                    >CONTACT</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
