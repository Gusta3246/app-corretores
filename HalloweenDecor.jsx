import React from 'react';

// Morcego em SVG (usa currentColor)
const Bat = ({ size = 28, style }) => (
  <svg width={size} height={size * 0.55} viewBox="0 0 64 36" fill="currentColor" style={style} aria-hidden="true">
    <path d="M32 10c-2 0-3 2-4 4-3-3-7-5-12-5-5 0-10 2-14 6 4 0 7 2 8 5 3-2 6-2 8 0 2 2 3 5 3 8 2-2 4-3 7-3 1 3 3 5 4 5s3-2 4-5c3 0 5 1 7 3 0-3 1-6 3-8 2-2 5-2 8 0 1-3 4-5 8-5-4-4-9-6-14-6-5 0-9 2-12 5-1-2-2-4-4-4z" />
  </svg>
);

// Teia de aranha no canto (flip controla qual canto)
export const Cobweb = ({ size = 120, flip = false, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.8"
    style={{ transform: flip ? 'scaleX(-1)' : undefined, ...style }} aria-hidden="true">
    <path d="M0 0 L100 0 M0 0 L0 100 M0 0 L88 52 M0 0 L52 88 M0 0 L98 22 M0 0 L22 98" />
    <path d="M18 0 Q14 14 0 18 M36 0 Q28 28 0 36 M56 0 Q42 42 0 56 M78 0 Q58 58 0 78" />
  </svg>
);

const Ghost = ({ size = 34 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
    <path d="M20 3C12 3 7 9 7 17v18l4-3 4 4 5-4 5 4 4-4 4 3V17C33 9 28 3 20 3z" fill="rgba(255,255,255,0.92)" />
    <circle cx="15" cy="17" r="2.6" fill="#1a0b2e" /><circle cx="25" cy="17" r="2.6" fill="#1a0b2e" />
    <ellipse cx="20" cy="24" rx="3" ry="3.6" fill="#1a0b2e" />
  </svg>
);

// Decoração do HERO (lua, morcegos voando, fantasmas, teias, névoa)
export function HalloweenHeroDecor() {
  return (
    <div className="hw-hero-decor" aria-hidden="true">
      <div className="hw-hero-wash" />
      <div className="hw-moon" />
      <Cobweb size={240} style={{ position: 'absolute', top: 0, left: 0, color: 'rgba(255,255,255,0.35)' }} />
      <Cobweb size={240} flip style={{ position: 'absolute', top: 0, right: 0, color: 'rgba(255,255,255,0.35)' }} />
      <span className="hw-bat hw-bat-1"><Bat size={78} /></span>
      <span className="hw-bat hw-bat-2"><Bat size={52} /></span>
      <span className="hw-bat hw-bat-3"><Bat size={64} /></span>
      <span className="hw-bat hw-bat-4"><Bat size={96} /></span>
      <span className="hw-ghost hw-ghost-1"><Ghost size={88} /></span>
      <span className="hw-ghost hw-ghost-2"><Ghost size={58} /></span>
      <div className="hw-fog" />
    </div>
  );
}

// Decoração do HEADER (teias nos cantos + aranha pendurada + morcego)
export function HalloweenHeaderDecor() {
  return (
    <div className="hw-header-decor" aria-hidden="true">
      <Cobweb size={64} style={{ position: 'absolute', top: 0, left: 0, color: 'rgba(255,170,60,0.45)' }} />
      <Cobweb size={64} flip style={{ position: 'absolute', top: 0, right: 0, color: 'rgba(255,170,60,0.45)' }} />
      <span className="hw-spider"><i /><b>🕷️</b></span>
      <span className="hw-header-bat"><Bat size={18} /></span>
    </div>
  );
}

export const PumpkinIcon = ({ size = 14 }) => <span style={{ fontSize: size, lineHeight: 1 }}>🎃</span>;