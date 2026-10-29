import React, { useState, useEffect, useRef } from 'react';
import { KrathongData } from '../types';
import { KrathongGraphic } from './KrathongGraphic';
import { Heart, Sparkles, X, MessageSquare, Volume2, VolumeX, Eye, Music } from 'lucide-react';

interface RiverSceneProps {
  krathongs: KrathongData[];
  activeKrathongId?: string | null;
  onLikeKrathong?: (id: string) => void;
  musicPlaying?: boolean;
  onToggleMusic?: () => void;
  onOpenMusicModal?: () => void;
  onOpenGallery?: () => void;
  onOpenWishes?: () => void;
  totalCounter?: number;
  interactive?: boolean;
}

export const RiverScene: React.FC<RiverSceneProps> = ({
  krathongs,
  activeKrathongId = null,
  onLikeKrathong,
  musicPlaying,
  onToggleMusic,
  onOpenMusicModal,
  onOpenGallery,
  onOpenWishes,
  totalCounter = 0,
  interactive = true,
}) => {
  const [selectedKrathong, setSelectedKrathong] = useState<KrathongData | null>(null);
  const [driftingKrathongs, setDriftingKrathongs] = useState<KrathongData[]>([]);
  const fireflyCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize and update drift positions
  useEffect(() => {
    setDriftingKrathongs(krathongs);
  }, [krathongs]);

  // Real-time smooth drifting movement across river
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const updatePositions = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      setDriftingKrathongs((prev) =>
        prev.map((k) => {
          let newX = k.xPercent + (k.speed || 0.015) * 6 * dt;
          if (newX > 108) newX = -8; // wrap smoothly around left river edge
          return { ...k, xPercent: newX };
        })
      );

      animId = requestAnimationFrame(updatePositions);
    };

    animId = requestAnimationFrame(updatePositions);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Floating Fireflies (หิ่งห้อยตามชายฝั่งแม่น้ำ) Particle Animation Canvas
  useEffect(() => {
    const canvas = fireflyCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    interface FireflyParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseAlpha: number;
      pulseSpeed: number;
      angle: number;
      color: string;
      glowRadius: number;
    }

    const fireflyColors = [
      'rgba(254, 240, 138, ', // Soft warm yellow (#fef08a)
      'rgba(253, 224, 71, ',  // Bright gold (#fde047)
      'rgba(163, 230, 53, ',  // Soft lime green (#a3e635)
      'rgba(251, 191, 36, ',  // Warm amber (#fbbf24)
    ];

    // Swarm of 50 firefly particles around river and banks
    const count = 50;
    const fireflies: FireflyParticle[] = Array.from({ length: count }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35, // Slow, peaceful floating motion
      vy: (Math.random() - 0.5) * 0.25,
      radius: 1.5 + Math.random() * 2.2,
      baseAlpha: 0.25 + Math.random() * 0.65,
      pulseSpeed: 0.012 + Math.random() * 0.02,
      angle: Math.random() * Math.PI * 2,
      color: fireflyColors[Math.floor(Math.random() * fireflyColors.length)],
      glowRadius: 10 + Math.random() * 14,
    }));

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      fireflies.forEach((f) => {
        // Natural sine-wave drift trajectory
        f.angle += f.pulseSpeed;
        f.x += f.vx + Math.sin(f.angle) * 0.25;
        f.y += f.vy + Math.cos(f.angle) * 0.2;

        // Wrap around canvas boundaries smoothly
        if (f.x < -20) f.x = width + 20;
        if (f.x > width + 20) f.x = -20;
        if (f.y < -20) f.y = height + 20;
        if (f.y > height + 20) f.y = -20;

        // Pulsing breathing light effect
        const currentAlpha = Math.max(0.08, Math.min(0.95, f.baseAlpha + Math.sin(f.angle * 2.5) * 0.4));

        // Outer soft radiant halo
        const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.glowRadius);
        grad.addColorStop(0, f.color + currentAlpha + ')');
        grad.addColorStop(0.35, f.color + (currentAlpha * 0.4) + ')');
        grad.addColorStop(1, f.color + '0)');

        ctx.save();
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Inner core bright point
        ctx.fillStyle = '#FFFFFF';
        ctx.globalAlpha = currentAlpha;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius * 0.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden bg-gradient-to-b from-[#02050e] via-[#07122b] via-[40%] to-[#030a1c] text-amber-50 select-none">
      {/* ----------------- NIGHT SKY BARS & STARS ----------------- */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Twinkling Stars */}
        {Array.from({ length: 45 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-amber-100 animate-pulse"
            style={{
              top: `${(i * 17) % 55}%`,
              left: `${(i * 23) % 98}%`,
              width: `${(i % 3) + 1.5}px`,
              height: `${(i % 3) + 1.5}px`,
              opacity: 0.3 + (i % 7) * 0.1,
              animationDuration: `${2 + (i % 4)}s`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}

        {/* Shooting star */}
        <div className="absolute top-12 right-1/4 w-32 h-[1px] bg-gradient-to-r from-transparent via-amber-200 to-transparent -rotate-45 opacity-60 animate-pulse" />

        {/* Soft mist clouds passing moon */}
        <div className="absolute top-16 inset-x-0 h-40 bg-gradient-to-r from-transparent via-blue-900/10 to-transparent blur-3xl opacity-50" />
      </div>

      {/* ----------------- FULL MOON & REFLECTION ----------------- */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-0 flex flex-col items-center pointer-events-none">
        {/* Glowing Full Moon */}
        <div className="relative w-36 h-36 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200 shadow-[0_0_90px_30px_rgba(251,191,36,0.35)] animate-moon-glow flex items-center justify-center">
          {/* Moon surface textures/craters */}
          <div className="absolute w-8 h-8 rounded-full bg-amber-200/40 top-6 left-8 blur-[1px]" />
          <div className="absolute w-12 h-12 rounded-full bg-amber-200/30 bottom-8 right-10 blur-[1px]" />
          <div className="absolute w-6 h-6 rounded-full bg-amber-300/30 top-12 right-8 blur-[1px]" />
        </div>

        {/* Soft Moon Halo */}
        <div className="w-[300px] md:w-[450px] h-24 bg-amber-200/10 rounded-full blur-2xl -mt-8" />
      </div>

      {/* ----------------- WATER SURFACE CANVA / HORIZON ----------------- */}
      <div className="absolute inset-x-0 bottom-0 top-[38%] z-0 overflow-hidden bg-gradient-to-b from-transparent via-[#061533]/50 to-[#020817]">
        {/* Seamless Horizon Mist Line */}
        <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-transparent via-blue-400/5 to-transparent blur-md pointer-events-none" />

        {/* Water specular moon reflection stream */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 md:w-[500px] h-full bg-gradient-to-b from-amber-300/25 via-amber-400/10 to-transparent blur-2xl pointer-events-none" />

        {/* Moving Water Ripple Lines */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent my-6 animate-pulse"
              style={{
                animationDuration: `${3 + (i % 3)}s`,
                animationDelay: `${i * 0.4}s`,
                transform: `scaleY(${1 + (i % 2) * 0.5})`,
              }}
            />
          ))}
        </div>

        {/* Canvas for Glowing Riverbank Firefly Particles */}
        <canvas
          ref={fireflyCanvasRef}
          className="absolute inset-0 pointer-events-none z-10 w-full h-full"
        />

        {/* ----------------- FLOATING KRATHONGS DRIFTING ----------------- */}
        <div className="relative w-full h-full max-w-7xl mx-auto">
          {driftingKrathongs.map((k, index) => {
            const isSelf = k.id === activeKrathongId;
            // Distribute vertical depth (20% to 80% of river height)
            const yDepth = 25 + (index * 13) % 60;
            // Calculate scale based on depth to give 3D perspective
            const perspectiveScale = 0.55 + (yDepth / 100) * 0.5;
            const floatDelay = (index * 0.7) % 3;

            return (
              <div
                key={k.id}
                onClick={() => interactive && setSelectedKrathong(k)}
                className={`absolute transition-all duration-300 cursor-pointer group ${
                  isSelf ? 'z-30' : 'z-10 hover:z-20'
                }`}
                style={{
                  top: `${yDepth}%`,
                  left: `${k.xPercent}%`,
                  transform: `translate(-50%, -50%) scale(${perspectiveScale})`,
                }}
              >
                {/* Candle Light Water Glow */}
                <div
                  className={`absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-12 rounded-full blur-md ${
                    isSelf ? 'bg-amber-400/50 animate-ping' : 'bg-amber-500/30'
                  }`}
                />

                {/* Self Indicator Banner */}
                {isSelf && (
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs rounded-full shadow-lg border border-amber-200 animate-bounce flex items-center gap-1 z-40">
                    <Sparkles className="w-3.5 h-3.5" />
                    กระทงของคุณ ({k.nickname})
                  </div>
                )}

                {/* Krathong SVG Render */}
                <div className="animate-float-gentle" style={{ animationDelay: `${floatDelay}s` }}>
                  <KrathongGraphic
                    style={k.style}
                    color={k.color}
                    decorations={k.decorations}
                    size={150}
                    animateFlame={true}
                  />
                </div>

                {/* Quick Nickname Tooltip on Hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 bg-slate-900/90 text-amber-200 text-xs rounded-md border border-amber-500/30 backdrop-blur-md pointer-events-none">
                  คุณ {k.nickname}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ----------------- TOP NAVBAR CONTROLS ----------------- */}
      <header className="relative z-30 flex items-center justify-between px-4 md:px-8 py-4 border-b border-amber-500/20 bg-slate-950/60 backdrop-blur-md">
        {/* Brand Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/30">
            V45
          </div>
          <div>
            <h1 className="font-chakra font-bold text-sm sm:text-base md:text-lg gold-gradient-text leading-tight">
              สืบสานวัฒนธรรมไทย ส่งความสุขและคำอธิษฐานจากใจชาว V45
            </h1>
            <p className="text-[11px] text-amber-200/70">ประเพณีลอยกระทง คืนวันเพ็ญ V45</p>
          </div>
        </div>

        {/* Counter & Action Controls */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Total Participants Counter */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-chakra">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>ร่วมลอยแล้ว: <strong className="text-amber-300 font-bold text-sm">{totalCounter.toLocaleString()}</strong> ใบ</span>
          </div>

          {/* Open Gallery */}
          {onOpenGallery && (
            <button
              onClick={onOpenGallery}
              className="px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-amber-500/30 text-amber-100 text-xs flex items-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">แกลเลอรี</span>
            </button>
          )}

          {/* Open Wishes Board */}
          {onOpenWishes && (
            <button
              onClick={onOpenWishes}
              className="px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-amber-500/30 text-amber-100 text-xs flex items-center gap-1.5 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">คำอธิษฐานทั้งหมด</span>
            </button>
          )}

          {/* Thai Traditional Audio Toggle & Music Settings */}
          <div className="flex items-center gap-1.5">
            {onToggleMusic && (
              <button
                onClick={onToggleMusic}
                className={`p-2 rounded-full border transition-all ${
                  musicPlaying
                    ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-lg shadow-amber-500/40 animate-pulse'
                    : 'bg-slate-900/80 text-amber-300 border-amber-500/30 hover:bg-slate-800'
                }`}
                title={musicPlaying ? 'ปิดเสียงดนตรี' : 'เปิดเสียงดนตรีบรรเลง'}
              >
                {musicPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            )}

            {onOpenMusicModal && (
              <button
                onClick={onOpenMusicModal}
                className="p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-amber-500/30 text-amber-300 hover:text-white transition-all"
                title="ตั้งค่าเพลงลอยกระทง / อัปโหลด MP3 ของตัวเอง"
              >
                <Music className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Quick Floating Participant Chips Ribbon */}
      <div className="relative z-20 px-4 py-2 bg-slate-950/50 border-b border-amber-500/10 backdrop-blur-md overflow-x-auto flex items-center gap-2 text-xs scrollbar-none">
        <span className="text-[11px] text-amber-300/90 font-medium shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          คลิกชื่อพนักงานเพื่อเปิดดูคำอธิษฐานกระทงบนแม่น้ำ:
        </span>
        {driftingKrathongs.map((k) => (
          <button
            key={k.id}
            onClick={() => setSelectedKrathong(k)}
            className="px-2.5 py-1 rounded-full bg-slate-900/90 hover:bg-amber-500/30 border border-amber-500/30 text-amber-200 text-[11px] shrink-0 transition-all active:scale-95 flex items-center gap-1 shadow-sm font-medium"
          >
            <span>🪷 {k.nickname}</span>
          </button>
        ))}
      </div>

      {/* ----------------- INTERACTIVE KRATHONG INSPECTION MODAL ----------------- */}
      {selectedKrathong && (
        <div
          onClick={() => setSelectedKrathong(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md glass-panel-gold rounded-2xl p-6 border border-amber-400/40 text-center shadow-2xl cursor-default"
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedKrathong(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-amber-300 hover:text-white hover:bg-white/10 transition-colors"
              title="ปิดหน้าต่าง"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Krathong Preview */}
            <div className="flex justify-center -mt-2 mb-3">
              <KrathongGraphic
                style={selectedKrathong.style}
                color={selectedKrathong.color}
                decorations={selectedKrathong.decorations}
                size={160}
              />
            </div>

            {/* Author info */}
            <div className="inline-block px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold mb-2">
              พนักงาน V45
            </div>
            <h3 className="font-chakra font-bold text-xl text-white mb-3">
              กระทงของคุณ "{selectedKrathong.nickname}"
            </h3>

            {/* Wish box */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/20 text-amber-100/90 text-sm italic font-sarabun leading-relaxed mb-5 shadow-inner">
              "{selectedKrathong.wish}"
            </div>

            {/* Like & Actions */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-amber-500/20 mb-3">
              <span className="text-xs text-amber-200/60">
                ลอยเมื่อ {new Date(selectedKrathong.timestamp).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
              </span>

              <button
                onClick={() => {
                  if (onLikeKrathong) onLikeKrathong(selectedKrathong.id);
                  setSelectedKrathong(prev => prev ? { ...prev, likes: (prev.likes || 0) + 1 } : null);
                }}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-pink-500/30 transition-transform active:scale-95"
              >
                <Heart className="w-4 h-4 fill-white" />
                ส่งกำลังใจ ({selectedKrathong.likes || 0})
              </button>
            </div>

            {/* Close / Return to River View Button */}
            <button
              onClick={() => setSelectedKrathong(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-200 text-xs font-bold border border-amber-500/30 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>🌊 ปิดหน้าต่างนี้เพื่อชมสายน้ำกระทงเต็มตา</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
