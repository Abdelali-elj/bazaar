import React from 'react';
import { Link } from 'react-router-dom';

import { Instagram, Facebook, Mail, Phone, MapPin, Heart, Send, ShieldCheck, Truck, CreditCard, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="footer" className="bg-[#0A0A0A] text-white pt-24 pb-12 overflow-hidden relative border-t border-white/5">
      {/* Decorative top gradient line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C9A96E]/30 to-transparent" />
      
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-12">
          
          {/* Brand Section */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold tracking-tighter uppercase leading-none italic" style={{ fontFamily: "'Playfair Display', serif" }}>
              Bazaar <span className="text-[#C9A96E] not-italic">Style.</span>
            </h2>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs font-light">
              L'excellence du style et de la beauté professionnelle. Une sélection exclusive pour sublimer votre éclat naturel.
            </p>
            <div className="flex items-center gap-4">
              {[
                { 
                  name: "Facebook", 
                  href: "#",
                  icon: <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
                },
                { 
                  name: "Instagram", 
                  href: "#",
                  icon: <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
                },
                { 
                  name: "TikTok", 
                  href: "#",
                  icon: <path d="M12.525.025c-3.309.005-4.904-.005-4.904-.005v16.115c0 2.247-1.821 4.068-4.068 4.068-2.246 0-4.067-1.821-4.067-4.068 0-2.246 1.821-4.067 4.067-4.067.43 0 .847.067 1.238.192V8.307a8.03 8.03 0 0 0-1.238-.096C3.58 8.211 0 11.792 0 16.115c0 4.324 3.58 7.905 7.905 7.905 4.324 0 7.905-3.581 7.905-7.905V6.784c2.19.006 4.417 1.638 5.485 3.865h3.705c-.657-3.411-3.302-5.912-6.529-6.39v-4.234z" />
                },
                { 
                  name: "WhatsApp", 
                  href: "#",
                  icon: <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.409h-.004a9.8 9.8 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.81 11.81 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413Z" />
                }
              ].map((social, i) => (
                <a key={i} href={social.href} title={social.name} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#C9A96E] hover:border-[#C9A96E] hover:-translate-y-1 transition-all duration-300 group text-[#C9A96E] hover:text-[#1A2E28]">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    {social.icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation links - Termes et politiques */}
          <div className="space-y-8">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#C9A96E]" style={{ fontFamily: "'Outfit', sans-serif" }}>Termes et politiques</h3>
            <ul className="space-y-4">
              {[
                { label: 'Privacy Policy', href: '#' },
                { label: "Conditions d'utilisation", href: '#' },
                { label: 'Retours & échanges', href: '#' },
                { label: 'Politique de Confidentialité', href: '#' },
              ].map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href} 
                    className="text-sm text-white/40 hover:text-white hover:translate-x-1 flex items-center gap-2 transition-all duration-300 group"
                  >
                    <span className="w-0 h-[1px] bg-[#C9A96E] group-hover:w-4 transition-all duration-300"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contactez-nous */}
          <div className="space-y-8">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#C9A96E]" style={{ fontFamily: "'Outfit', sans-serif" }}>Contactez-nous</h3>
            <ul className="space-y-4">
              {[
                { label: "Contactez nous", href: '/contact' },
                { label: "Aide & FAQ", href: '#' },
              ].map((link, i) => (
                <li key={i}>
                  <Link to={link.href} className="text-sm text-white/40 hover:text-white hover:translate-x-1 flex items-center gap-2 transition-all duration-300 group">
                    <span className="w-0 h-[1px] bg-[#C9A96E] group-hover:w-4 transition-all duration-300"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="pt-4 space-y-3 border-t border-white/5">
              <div className="flex items-center gap-3">
                <Phone size={14} className="text-[#C9A96E]" />
                <span className="text-sm text-white/60">+212 6 91 07 78 35</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={14} className="text-[#C9A96E]" />
                <span className="text-sm text-white/60">contact@bazaarstyle.ma</span>
              </div>
            </div>
          </div>

          {/* A propos du magasin */}
          <div className="space-y-8">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#C9A96E]" style={{ fontFamily: "'Outfit', sans-serif" }}>A propos du magasin</h3>
            <ul className="space-y-4">
              {[
                { label: "À propos", href: '#about' },
                { label: "Méthodes de payement", href: '#' },
                { label: "Expedition et manutention", href: '#' },
              ].map((link, i) => (
                <li key={i}>
                  <Link to={link.href} className="text-sm text-white/40 hover:text-white hover:translate-x-1 flex items-center gap-2 transition-all duration-300 group">
                    <span className="w-0 h-[1px] bg-[#C9A96E] group-hover:w-4 transition-all duration-300"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Trust & Payments Row */}
        <div className="mt-20 py-10 border-y border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
          {[
            { icon: ShieldCheck, title: "Paiement Sécurisé", desc: "Transactions 100% protégées" },
            { icon: Truck, title: "Livraison Rapide", desc: "Expédition sous 48h au Maroc" },
            { icon: CreditCard, title: "Paiement Flexible", desc: "Visa, Mastercard & Cash" },
            { icon: Heart, title: "Satisfaction", desc: "Service client à votre écoute" }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center md:items-start text-center md:text-left gap-3 group">
              <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <item.icon size={20} className="text-[#C9A96E]" strokeWidth={1} />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-white/80">{item.title}</h4>
                <p className="text-[9px] text-white/30 uppercase tracking-[0.1em]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-center bg-white/[0.02] p-6 rounded-3xl border border-white/5">
          <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em]">
            © 2024 Bazaar Style. L'Excellence Beauté.
          </p>
          
          <div className="flex items-center gap-6">
            {['Visa', 'Mastercard', 'PayPal', 'Maestro'].map((p) => (
              <span key={p} className="text-[8px] font-black text-white/10 uppercase tracking-[0.4em] hover:text-[#C9A96E] cursor-default transition-colors">{p}</span>
            ))}
          </div>

          <div className="flex gap-6">
            <a href="#" className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] hover:text-[#C9A96E] transition-colors">Confidentialité</a>
            <a href="#" className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] hover:text-[#C9A96E] transition-colors">Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
