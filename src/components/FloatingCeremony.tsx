import React, { useEffect, useState } from 'react';
import { KrathongData } from '../types';
import { KrathongGraphic } from './KrathongGraphic';
import { Sparkles, Heart } from 'lucide-react';

interface FloatingCeremonyProps {
  krathong: KrathongData;
  onCeremonyComplete: () => void;
}

export const FloatingCeremony: React.FC<FloatingCeremonyProps> = ({
  krathong,
  onCeremonyComplete,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(9);
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    // 9 second countdown animation
    const startTime = Date.now();
    const duration = 9000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / duration) * 100);
      setProgressPercent(progress);

      const remaining = Math.max(0, Math.ceil((duration - elapsed) / 1000));
      setSecondsLeft(remaining);

      if (elapsed >= duration) {
        clearInterval(interval);
        onCeremonyComplete();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [onCeremonyComplete]);

  // Calculate Y position moving from bottom (110%) up into river middle (45%) and drifting left/right
  const yPos = 110 - (progressPercent / 100) * 65; // from 110% to 45%
  const xOffset = Math.sin((progressPercent / 100) * Math.PI * 2) * 15; // gentle wave drift

  return (
    <div className="fixed inset-0 z-40 pointer-events-none flex flex-col items-center justify-between p-6">
      {/* Top Banner Message */}
      <div className="mt-12 px-6 py-3 rounded-full glass-panel-gold border border-amber-400/50 shadow-2xl flex items-center gap-3 animate-bounce">
        <Sparkles className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
        <span className="font-chakra font-bold text-base md:text-lg gold-gradient-text">
          กำลังนำกระทงลงสู่สายน้ำ... ({secondsLeft}s)
        </span>
      </div>

      {/* Krathong Sliding and Floating Down River */}
      <div
        className="absolute transition-all duration-300 ease-out flex flex-col items-center"
        style={{
          top: `${yPos}%`,
          left: `calc(${krathong.xPercent}% + ${xOffset}px)`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Golden Sparkle Aura Particles */}
        <div className="absolute inset-0 rounded-full bg-amber-400/30 blur-2xl animate-ping" />

        {/* Expanding Water Ripples */}
        <div className="absolute bottom-0 w-48 h-16 rounded-full border-2 border-amber-400/60 animate-water-ripple" />
        <div className="absolute bottom-0 w-64 h-20 rounded-full border border-amber-300/40 animate-water-ripple" style={{ animationDelay: '1s' }} />

        {/* Floating Krathong Graphic */}
        <div className="animate-float-gentle relative z-10 scale-125 md:scale-150">
          <KrathongGraphic
            style={krathong.style}
            color={krathong.color}
            decorations={krathong.decorations}
            size={180}
            animateFlame={true}
          />
        </div>

        {/* Subtitle Name */}
        <div className="mt-2 px-3 py-1 rounded-full bg-slate-900/90 text-amber-300 font-bold text-xs border border-amber-500/30 shadow-lg flex items-center gap-1">
          <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
          {krathong.nickname}
        </div>
      </div>

      {/* Bottom Progress Bar */}
      <div className="w-full max-w-md bg-slate-900/80 rounded-full h-2.5 p-0.5 border border-amber-500/30 mb-8 backdrop-blur-md">
        <div
          className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-300 h-full rounded-full transition-all duration-100 shadow-md shadow-amber-500/50"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
