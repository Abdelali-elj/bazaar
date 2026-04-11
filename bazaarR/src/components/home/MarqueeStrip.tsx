
import React from 'react';

const PHRASES = [
  "Beauté Professionnelle",
  "★",
  "Livraison Rapide",
  "★",
  "Soins Premium",
  "★",
  "Collection Exclusive",
  "★",
  "Qualité Garantie",
  "★",
  "L'Art du Style",
  "★",
  "Bazaar Style — Élevez Votre Look",
  "★",
  "Nouveaux Produits Chaque Semaine",
  "★",
];

export default function MarqueeStrip() {
  // Duplicate phrases for seamless loop
  const items = [...PHRASES, ...PHRASES];

  return (
    <div
      className="w-full overflow-hidden py-4 select-none"
      style={{ backgroundColor: '#1A1A1A' }}
    >
      <div
        className="flex whitespace-nowrap"
        style={{ animation: 'marqueeScroll 28s linear infinite' }}
      >
        {items.map((phrase, i) => (
          <span
            key={i}
            className="inline-flex items-center shrink-0 px-6"
            style={{
              fontFamily: phrase === '★' ? 'inherit' : "'Jost', sans-serif",
              fontSize: phrase === '★' ? '10px' : '11px',
              fontWeight: phrase === '★' ? 400 : 600,
              letterSpacing: phrase === '★' ? '0.1em' : '0.3em',
              textTransform: 'uppercase',
              color: phrase === '★' ? '#C9A96E' : 'rgba(255,255,255,0.65)',
            }}
          >
            {phrase}
          </span>
        ))}
      </div>

      
    </div>
  );
}
