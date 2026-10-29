import React from 'react';
import { KrathongStyle, KrathongColor, KrathongDecorations } from '../types';

interface KrathongGraphicProps {
  style: KrathongStyle;
  color: KrathongColor;
  decorations: KrathongDecorations;
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
  animateFlame?: boolean;
}

export const KrathongGraphic: React.FC<KrathongGraphicProps> = ({
  style,
  color,
  decorations,
  size = 'md',
  className = '',
  animateFlame = true,
}) => {
  // Determine SVG width/height
  let pixelSize = 220;
  if (typeof size === 'number') {
    pixelSize = size;
  } else {
    switch (size) {
      case 'sm': pixelSize = 100; break;
      case 'md': pixelSize = 180; break;
      case 'lg': pixelSize = 260; break;
      case 'xl': pixelSize = 340; break;
    }
  }

  // Accent color mappings
  const colorMap: Record<KrathongColor, { primary: string; secondary: string; light: string; glow: string }> = {
    gold: { primary: '#F59E0B', secondary: '#D97706', light: '#FDE68A', glow: 'rgba(245, 158, 11, 0.6)' },
    pink: { primary: '#EC4899', secondary: '#BE185D', light: '#FBCFE8', glow: 'rgba(236, 72, 153, 0.6)' },
    blue: { primary: '#3B82F6', secondary: '#1D4ED8', light: '#BFDBFE', glow: 'rgba(59, 130, 246, 0.6)' },
    purple: { primary: '#A855F7', secondary: '#7E22CE', light: '#E9D5FF', glow: 'rgba(168, 85, 247, 0.6)' },
    emerald: { primary: '#10B981', secondary: '#047857', light: '#A7F3D0', glow: 'rgba(16, 185, 129, 0.6)' },
  };

  const palette = colorMap[color] || colorMap.gold;

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: pixelSize, height: pixelSize }}
    >
      <svg
        viewBox="0 0 300 300"
        className="w-full h-full drop-shadow-2xl overflow-visible"
        style={{ filter: `drop-shadow(0 15px 25px rgba(0, 0, 0, 0.7))` }}
      >
        <defs>
          {/* Candle Flame Glow */}
          <radialGradient id="flameGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFBEB" stopOpacity="1" />
            <stop offset="35%" stopColor="#FBBF24" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#F59E0B" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
          </radialGradient>

          {/* Golden Petal Gradient */}
          <linearGradient id="goldPetal" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FEF3C7" />
            <stop offset="40%" stopColor="#FBBF24" />
            <stop offset="85%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          {/* Banana Leaf Gradient */}
          <linearGradient id="bananaLeaf" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4ADE80" />
            <stop offset="50%" stopColor="#16A34A" />
            <stop offset="100%" stopColor="#14532D" />
          </linearGradient>

          {/* Coconut Shell Gradient */}
          <linearGradient id="coconutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#78350F" />
            <stop offset="50%" stopColor="#451A03" />
            <stop offset="100%" stopColor="#1C1008" />
          </linearGradient>

          {/* Custom Color Petal Gradient */}
          <linearGradient id="accentPetal" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={palette.light} />
            <stop offset="50%" stopColor={palette.primary} />
            <stop offset="100%" stopColor={palette.secondary} />
          </linearGradient>

          {/* Sparkle filter */}
          <filter id="glowEffect" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ----------------- BASE WATER REFLECTION RIPPLE ----------------- */}
        <ellipse
          cx="150"
          cy="255"
          rx="120"
          ry="30"
          fill="rgba(245, 158, 11, 0.15)"
          className="animate-pulse"
        />

        {/* ----------------- SPARKLE AURA IF ENABLED ----------------- */}
        {decorations.sparkles && (
          <g filter="url(#glowEffect)">
            <circle cx="60" cy="120" r="3" fill="#FDE68A" opacity="0.8" />
            <circle cx="240" cy="110" r="4" fill="#FDE68A" opacity="0.9" />
            <circle cx="80" cy="220" r="2.5" fill="#FDE68A" opacity="0.7" />
            <circle cx="220" cy="230" r="3" fill="#FDE68A" opacity="0.85" />
            <path
              d="M150 40 L152 48 L160 50 L152 52 L150 60 L148 52 L140 50 L148 48 Z"
              fill="#FEF3C7"
              opacity="0.9"
            />
          </g>
        )}

        {/* ----------------- BASE LAYER (KRATHONG BODY) ----------------- */}

        {/* STYLE 1: TRADITIONAL BANANA LEAF (กระทงใบตอง) */}
        {style === 'traditional' && (
          <g id="traditional-krathong">
            {/* Outer banana leaf petals */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
              <g key={i} transform={`rotate(${deg} 150 210)`}>
                <path
                  d="M150 145 C130 180 120 225 150 250 C180 225 170 180 150 145 Z"
                  fill="url(#bananaLeaf)"
                  stroke="#14532D"
                  strokeWidth="1.5"
                />
              </g>
            ))}

            {/* Inner folded leaf layer */}
            {[15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345].map((deg, i) => (
              <g key={i} transform={`rotate(${deg} 150 205)`}>
                <path
                  d="M150 160 C138 185 132 215 150 232 C168 215 162 185 150 160 Z"
                  fill="url(#accentPetal)"
                  stroke={palette.secondary}
                  strokeWidth="1"
                />
              </g>
            ))}

            {/* Banana slice base core */}
            <ellipse cx="150" cy="205" rx="65" ry="32" fill="#15803D" stroke="#166534" strokeWidth="3" />
            <ellipse cx="150" cy="205" rx="55" ry="26" fill="#22C55E" opacity="0.85" />
            <ellipse cx="150" cy="205" rx="45" ry="20" fill="#86EFAC" opacity="0.6" />
          </g>
        )}

        {/* STYLE 2: LOTUS FLOWER (กระทงดอกบัว) */}
        {style === 'lotus' && (
          <g id="lotus-krathong">
            {/* Outer Lotus Petals */}
            {[0, 24, 48, 72, 96, 120, 144, 168, 192, 216, 240, 264, 288, 312, 336].map((deg, i) => (
              <g key={i} transform={`rotate(${deg} 150 210)`}>
                <path
                  d="M150 135 Q120 185 140 250 Q160 250 180 185 Z"
                  fill="url(#accentPetal)"
                  stroke={palette.secondary}
                  strokeWidth="1"
                />
              </g>
            ))}

            {/* Mid Lotus Petals */}
            {[12, 36, 60, 84, 108, 132, 156, 180, 204, 228, 252, 276, 300, 324, 348].map((deg, i) => (
              <g key={i} transform={`rotate(${deg} 150 208)`}>
                <path
                  d="M150 150 Q128 190 145 238 Q155 238 172 190 Z"
                  fill="url(#accentPetal)"
                  opacity="0.9"
                />
              </g>
            ))}

            {/* Lotus Seed Pod Center */}
            <ellipse cx="150" cy="208" rx="50" ry="25" fill="#EAB308" stroke="#CA8A04" strokeWidth="2" />
            <ellipse cx="150" cy="208" rx="40" ry="20" fill="#FEF08A" />
            {/* Seed holes */}
            {[-20, -10, 0, 10, 20].map((xOffset, idx) => (
              <circle key={idx} cx={150 + xOffset} cy={208 + (idx % 2 === 0 ? -4 : 4)} r="2.5" fill="#854D0E" />
            ))}
          </g>
        )}

        {/* STYLE 3: GOLDEN LOTUS (กระทงกลีบบัวสีทอง) */}
        {style === 'golden_lotus' && (
          <g id="golden-lotus-krathong">
            {/* Outer Royal Golden Petals */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
              <g key={i} transform={`rotate(${deg} 150 210)`}>
                <path
                  d="M150 125 C115 175 110 230 150 255 C190 230 185 175 150 125 Z"
                  fill="url(#goldPetal)"
                  stroke="#B45309"
                  strokeWidth="2"
                />
                {/* Petal Golden Vein Line */}
                <path d="M150 135 L150 240" stroke="#FEF3C7" strokeWidth="1.2" opacity="0.8" />
              </g>
            ))}

            {/* Inner Metallic Gold Rim */}
            <ellipse cx="150" cy="210" rx="60" ry="30" fill="url(#goldPetal)" stroke="#FBBF24" strokeWidth="2" />
            <ellipse cx="150" cy="210" rx="48" ry="23" fill="#FEF3C7" opacity="0.9" />
          </g>
        )}

        {/* STYLE 4: ECO COCONUT SHELL (กระทงกะลามะพร้าว) */}
        {style === 'eco_coconut' && (
          <g id="eco-coconut-krathong">
            {/* Coconut Shell Bowl */}
            <path
              d="M75 190 C75 260 225 260 225 190 Q150 215 75 190 Z"
              fill="url(#coconutGrad)"
              stroke="#B45309"
              strokeWidth="2"
            />
            {/* Floral edge rim */}
            {[80, 105, 130, 155, 180, 205, 220].map((x, i) => (
              <circle key={i} cx={x} cy={195 + Math.sin(i) * 3} r="9" fill="url(#accentPetal)" />
            ))}
            <ellipse cx="150" cy="195" rx="68" ry="18" fill="#451A03" opacity="0.8" />
          </g>
        )}

        {/* ----------------- EXTRA LOTUS PETALS DECORATION ----------------- */}
        {decorations.lotusPetals && (
          <g id="decor-petals">
            {[20, 80, 140, 200, 260, 320].map((deg, i) => (
              <g key={i} transform={`rotate(${deg} 150 205)`}>
                <path d="M150 175 Q140 195 150 210 Q160 195 150 175 Z" fill={palette.light} opacity="0.9" />
              </g>
            ))}
          </g>
        )}

        {/* ----------------- FLOWERS CROWN (ดอกไม้ประดับ) ----------------- */}
        {decorations.flowers && (
          <g id="decor-flowers">
            {/* Marigolds & Orchids Around Center */}
            <circle cx="115" cy="205" r="14" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
            <circle cx="115" cy="205" r="9" fill="#FCD34D" />

            <circle cx="185" cy="205" r="14" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
            <circle cx="185" cy="205" r="9" fill="#FCD34D" />

            <circle cx="150" cy="222" r="12" fill="#EC4899" stroke="#9D174D" strokeWidth="1" />
            <circle cx="150" cy="222" r="7" fill="#FBCFE8" />

            <circle cx="132" cy="190" r="10" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
            <circle cx="132" cy="190" r="5" fill="#FEF08A" />

            <circle cx="168" cy="190" r="10" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
            <circle cx="168" cy="190" r="5" fill="#FEF08A" />
          </g>
        )}

        {/* ----------------- JOSS STICKS (ธูป 3 ดอก) ----------------- */}
        {decorations.jossSticks && (
          <g id="decor-joss-sticks">
            {/* Stick 1 */}
            <line x1="142" y1="205" x2="135" y2="105" stroke="#9A3412" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="135" y1="105" x2="135" y2="92" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
            <circle cx="135" cy="92" r="2.5" fill="#F59E0B" className={animateFlame ? 'animate-ping' : ''} />

            {/* Stick 2 (Center) */}
            <line x1="150" y1="205" x2="150" y2="95" stroke="#9A3412" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="150" y1="95" x2="150" y2="82" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
            <circle cx="150" cy="82" r="2.5" fill="#F59E0B" className={animateFlame ? 'animate-ping' : ''} />

            {/* Stick 3 */}
            <line x1="158" y1="205" x2="165" y2="105" stroke="#9A3412" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="165" y1="105" x2="165" y2="92" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
            <circle cx="165" cy="92" r="2.5" fill="#F59E0B" className={animateFlame ? 'animate-ping' : ''} />

            {/* Incense Smoke Particles */}
            {animateFlame && (
              <g className="animate-smoke" opacity="0.6">
                <circle cx="135" cy="80" r="4" fill="#E2E8F0" />
                <circle cx="150" cy="70" r="5" fill="#CBD5E1" />
                <circle cx="165" cy="80" r="4" fill="#E2E8F0" />
              </g>
            )}
          </g>
        )}

        {/* ----------------- CANDLE WITH FLAME (เทียนส่องสว่าง) ----------------- */}
        {decorations.candle && (
          <g id="decor-candle">
            {/* Candle Body */}
            <rect x="144" y="115" width="12" height="80" rx="3" fill="#FEF08A" stroke="#EAB308" strokeWidth="1.5" />
            <rect x="146" y="120" width="8" height="70" rx="2" fill="#FFFFFF" opacity="0.8" />
            {/* Candle Wick */}
            <line x1="150" y1="115" x2="150" y2="102" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />

            {/* Glowing Flame Halo */}
            <circle
              cx="150"
              cy="90"
              r="28"
              fill="url(#flameGlow)"
              className={animateFlame ? 'animate-pulse' : ''}
            />

            {/* Flame Body */}
            <path
              d="M150 72 C142 85 142 96 150 102 C158 96 158 85 150 72 Z"
              fill="#F59E0B"
              className={animateFlame ? 'animate-candle-flicker' : ''}
              style={{ transformOrigin: '150px 102px' }}
            />
            {/* Inner Flame Core */}
            <path
              d="M150 82 C146 90 146 97 150 101 C154 97 154 90 150 82 Z"
              fill="#FEF3C7"
              className={animateFlame ? 'animate-candle-flicker' : ''}
              style={{ transformOrigin: '150px 101px' }}
            />
          </g>
        )}
      </svg>
    </div>
  );
};
