import React, { useEffect, useRef, useState } from 'react';
import { KrathongData } from '../types';
import { KrathongGraphic } from './KrathongGraphic';
import { Sparkles, MessageSquare, Eye, RotateCcw, Heart, Users } from 'lucide-react';

interface ResultViewProps {
  krathong: KrathongData;
  allKrathongs?: KrathongData[];
  onLikeKrathong?: (id: string) => void;
  onOpenWishes: () => void;
  onBackToRiver: () => void;
  onReCreate: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  krathong,
  allKrathongs = [],
  onLikeKrathong,
  onOpenWishes,
  onBackToRiver,
  onReCreate,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [otherKrathongs, setOtherKrathongs] = useState<KrathongData[]>([]);

  useEffect(() => {
    // Filter out user's own current krathong to show colleagues
    setOtherKrathongs(allKrathongs.filter((k) => k.id !== krathong.id));
  }, [allKrathongs, krathong.id]);

  // Canvas Golden Fireworks & Flower Petals Animation Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Firework & Petal Particles
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      decay: number;
      type: 'firework' | 'petal';
      rotation: number;
      rotSpeed: number;
    }

    let particles: Particle[] = [];

    // Spawn golden firework bursts
    const createBurst = (cx: number, cy: number) => {
      const count = 50;
      const colors = ['#F59E0B', '#FBBF24', '#FEF3C7', '#FDE68A', '#EC4899'];
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const speed = 2 + Math.random() * 5;
        particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 2 + Math.random() * 3,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: 0.015 + Math.random() * 0.02,
          type: 'firework',
          rotation: 0,
          rotSpeed: 0,
        });
      }
    };

    // Initial bursts
    createBurst(width * 0.2, height * 0.3);
    createBurst(width * 0.8, height * 0.3);
    createBurst(width * 0.5, height * 0.2);

    // Spawn falling flower petals continuously
    const colors = ['#F472B6', '#F43F5E', '#FBBF24', '#F3E8FF'];
    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: 1 + Math.random() * 2,
        size: 6 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.8,
        decay: 0,
        type: 'petal',
        rotation: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.05,
      });
    }

    let animId: number;
    let burstTimer = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      burstTimer++;
      if (burstTimer % 90 === 0) {
        createBurst(Math.random() * width, Math.random() * (height * 0.5));
      }

      particles.forEach((p) => {
        if (p.type === 'firework') {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.05; // gravity
          p.alpha -= p.decay;

          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else if (p.type === 'petal') {
          p.x += p.vx + Math.sin(burstTimer * 0.02) * 0.5;
          p.y += p.vy;
          p.rotation += p.rotSpeed;

          if (p.y > height) {
            p.y = -20;
            p.x = Math.random() * width;
          }

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      particles = particles.filter((p) => p.type === 'petal' || p.alpha > 0);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="relative z-30 min-h-screen w-full flex flex-col items-center justify-start p-4 md:p-8 space-y-8 max-w-4xl mx-auto my-6 pointer-events-auto">
      {/* Canvas Layer for Fireworks & Falling Petals */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" />

      {/* Main Result Card */}
      <div className="relative z-20 w-full glass-panel-gold rounded-3xl p-6 sm:p-8 md:p-10 text-center border border-amber-400/50 shadow-2xl animate-fadeIn">
        {/* Top Gold Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold mb-4">
          <Sparkles className="w-4 h-4 text-amber-400" />
          ลอยกระทงสำเร็จแล้ว
        </div>

        {/* Main Blessing Title */}
        <h2 className="font-chakra text-2xl sm:text-3xl md:text-4xl font-extrabold gold-gradient-text mb-2">
          "ขอให้ทุกคำอธิษฐานของคุณเป็นจริง"
        </h2>

        {/* User Nickname & V45 Wish */}
        <div className="text-amber-100 font-sarabun text-base sm:text-lg mb-6">
          คุณ <span className="font-bold text-amber-300">{krathong.nickname}</span> · สุขสันต์วันลอยกระทงจาก V45
        </div>

        {/* Krathong Preview Container */}
        <div className="relative my-4 flex items-center justify-center p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 shadow-inner">
          <KrathongGraphic
            style={krathong.style}
            color={krathong.color}
            decorations={krathong.decorations}
            size={200}
            animateFlame={true}
          />
        </div>

        {/* Wish Quote Box */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 text-amber-100/90 text-sm font-sarabun italic leading-relaxed mb-8">
          "{krathong.wish}"
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Return to River */}
          <button
            onClick={onBackToRiver}
            className="py-3.5 px-5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-amber-500/30"
          >
            <Eye className="w-4 h-4" />
            <span>ชมสายน้ำกระทง V45</span>
          </button>

          {/* View Colleagues Wishes */}
          <button
            onClick={onOpenWishes}
            className="py-3.5 px-5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-amber-400/40 text-amber-200 font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md"
          >
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span>คำอธิษฐานพนักงานทั้งหมด</span>
          </button>
        </div>

        {/* Re-create button */}
        <div className="mt-6 pt-4 border-t border-amber-500/20">
          <button
            onClick={onReCreate}
            className="text-xs text-amber-300/70 hover:text-amber-200 inline-flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>สร้างกระทงใบใหม่</span>
          </button>
        </div>
      </div>

      {/* ----------------- COLLEAGUES KRATHONGS & WISHES SECTION ----------------- */}
      <div className="relative z-20 w-full glass-panel rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <h3 className="font-chakra font-bold text-lg text-white">
              กระทงและคำอธิษฐานจากเพื่อนพนักงาน V45
            </h3>
          </div>
          <button
            onClick={onOpenWishes}
            className="text-xs text-amber-300 hover:text-amber-100 flex items-center gap-1 transition-colors font-medium"
          >
            <span>ดูทั้งหมด ({allKrathongs.length})</span>
            <MessageSquare className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Grid List of Colleagues Floating Krathongs & Wishes Revealed */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {otherKrathongs.slice(0, 6).map((item) => (
            <div
              key={item.id}
              className="bg-slate-900/80 p-4 rounded-2xl border border-amber-500/20 hover:border-amber-400/40 transition-all flex items-start gap-3 shadow-md"
            >
              <div className="shrink-0 -mt-2">
                <KrathongGraphic
                  style={item.style}
                  color={item.color}
                  decorations={item.decorations}
                  size={80}
                  animateFlame={true}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <div className="font-bold text-sm text-amber-200 truncate">{item.nickname}</div>
                </div>

                <p className="text-xs text-amber-100/90 font-sarabun italic leading-relaxed line-clamp-3 mb-2">
                  "{item.wish}"
                </p>

                <div className="flex justify-between items-center text-[11px] text-amber-300/60 pt-1 border-t border-amber-500/10">
                  <span>{new Date(item.timestamp).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.</span>

                  <button
                    onClick={() => onLikeKrathong && onLikeKrathong(item.id)}
                    className="flex items-center gap-1 text-pink-400 hover:text-pink-300 font-bold transition-transform active:scale-95"
                  >
                    <Heart className="w-3.5 h-3.5 fill-pink-400" />
                    <span>{item.likes || 0}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

