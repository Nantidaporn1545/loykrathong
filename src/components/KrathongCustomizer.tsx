import React, { useState } from 'react';
import { KrathongStyle, KrathongColor, KrathongDecorations } from '../types';
import { KrathongGraphic } from './KrathongGraphic';
import { Sparkles, Wand2, Check, ArrowLeft, RefreshCw, HeartHandshake } from 'lucide-react';

interface KrathongCustomizerProps {
  nickname: string;
  department: string;
  onBack: () => void;
  onSubmitKrathong: (
    style: KrathongStyle,
    color: KrathongColor,
    decorations: KrathongDecorations,
    wish: string
  ) => void;
}

const STYLES: { id: KrathongStyle; label: string; desc: string }[] = [
  { id: 'traditional', label: 'กระทงใบตองแบบดั้งเดิม', desc: 'ทำจากใบตองสดพับอย่างประณีต มงคลและเป็นธรรมชาติ' },
  { id: 'lotus', label: 'กระทงดอกบัว', desc: 'กลีบบัวบานสะพรั่ง อ่อนหวาน นุ่มนวล สงบเย็น' },
  { id: 'golden_lotus', label: 'กระทงกลีบบัวสีทอง', desc: 'หรูหรา ทรงคุณค่า ประกายทองส่องสว่างส่งต่อความสำเร็จ' },
  { id: 'eco_coconut', label: 'กระทงกะลามะพร้าว', desc: 'กะลามะพร้าวสืบสานภูมิปัญญา รักษ์โลก ชุมชนไทย' },
];

const COLORS: { id: KrathongColor; label: string; hex: string }[] = [
  { id: 'gold', label: 'ทอง', hex: '#F59E0B' },
  { id: 'pink', label: 'ชมพู', hex: '#EC4899' },
  { id: 'blue', label: 'ฟ้า', hex: '#3B82F6' },
  { id: 'purple', label: 'ม่วง', hex: '#A855F7' },
  { id: 'emerald', label: 'เขียวมรกต', hex: '#10B981' },
];

const PRESET_WISHES = [
  'ขอให้สุขภาพแข็งแรง มีความสุข และประสบความสำเร็จในทุกด้าน',
  'ขอให้ทีมงาน V45 ทุกคนทำงานอย่างมีความสุข เติบโตก้าวหน้าไปด้วยกันอย่างมั่นคง',
  'ขอขมาพระแม่คงคา และขอให้ชีวิตพบเจอแต่สิ่งดีๆ ไร้โรคภัย ไข้เจ็บ',
  'ขอให้มีความมั่งคั่ง สมปรารถนา ทั้งเรื่องงาน เรื่องเงิน และครอบครัว',
];

export const KrathongCustomizer: React.FC<KrathongCustomizerProps> = ({
  nickname,
  department,
  onBack,
  onSubmitKrathong,
}) => {
  const [style, setStyle] = useState<KrathongStyle>('golden_lotus');
  const [color, setColor] = useState<KrathongColor>('gold');
  const [decorations, setDecorations] = useState<KrathongDecorations>({
    flowers: true,
    jossSticks: true,
    candle: true,
    lotusPetals: true,
    sparkles: true,
  });
  const [wish, setWish] = useState(PRESET_WISHES[0]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const maxChars = 300;
  const remainingChars = maxChars - wish.length;

  const toggleDecoration = (key: keyof KrathongDecorations) => {
    setDecorations((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // AI Wish Assistant polisher
  const handleAiPolishWish = async () => {
    setIsAiLoading(true);
    try {
      const response = await fetch('/api/ai-wish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wish, nickname, department }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.polishedWish) {
          setWish(data.polishedWish.slice(0, 300));
        }
      } else {
        // Fallback polish locally
        setWish(`ขออำนาจคุณพระศรีรัตนตรัยและพระแม่คงคา จงดลบันดาลให้คุณ${nickname} และครอบครัว ประสบแต่ความสุข ความเจริญ สุขภาพแข็งแรง ไร้ทุกข์โศกโรคภัย และก้าวหน้าในหน้าที่การงาน V45 อย่างยั่งยืน`);
      }
    } catch {
      setWish(`ขออำนาจคุณพระศรีรัตนตรัยและพระแม่คงคา จงดลบันดาลให้คุณ${nickname} และครอบครัว ประสบแต่ความสุข ความเจริญ สุขภาพแข็งแรง ไร้ทุกข์โศกโรคภัย และก้าวหน้าในหน้าที่การงาน V45 อย่างยั่งยืน`);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = () => {
    onSubmitKrathong(style, color, decorations, wish.trim() || PRESET_WISHES[0]);
  };

  return (
    <div className="relative min-h-screen w-full p-4 md:p-8 z-10 max-w-6xl mx-auto flex flex-col justify-between pointer-events-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-amber-500/20">
        <button
          onClick={onBack}
          className="px-3.5 py-1.5 rounded-full glass-panel hover:bg-slate-800 text-amber-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          ย้อนกลับ
        </button>

        <div className="text-right">
          <span className="text-xs text-amber-300/70">ผู้อธิษฐาน:</span>
          <span className="ml-1.5 text-sm font-bold text-amber-200">{nickname}</span>
        </div>
      </div>

      {/* Main Grid: Left Realtime Preview - Right Controls */}
      <div className="my-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Real-time Krathong Preview Card (5 cols) */}
        <div className="lg:col-span-5 glass-panel-gold rounded-3xl p-6 text-center border border-amber-400/40 sticky top-6 shadow-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            ตัวอย่างกระทงของคุณ (Real-time Preview)
          </div>

          <div className="relative my-4 flex items-center justify-center min-h-[260px] bg-gradient-to-b from-slate-950/80 to-blue-950/60 rounded-2xl border border-amber-500/20 p-4 shadow-inner">
            {/* Water Ripple Backdrop */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-16 bg-amber-400/20 rounded-full blur-xl animate-pulse" />
            </div>

            {/* Krathong Component */}
            <KrathongGraphic
              style={style}
              color={color}
              decorations={decorations}
              size={240}
              animateFlame={true}
            />
          </div>

          <p className="text-xs text-amber-200/60 italic font-sarabun">
            "องค์ประกอบและแสงเทียนส่องสว่างจะสะท้อนบนผิวน้ำอย่างเสมือนจริง"
          </p>
        </div>

        {/* Right Column: Customization & Wishes Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6 glass-panel rounded-3xl p-6 sm:p-8 border border-amber-500/30">
          {/* Section 1: Krathong Base Style */}
          <div>
            <h3 className="text-base font-chakra font-bold gold-gradient-text mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center border border-amber-400/40">1</span>
              เลือกรูปแบบกระทง
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {STYLES.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setStyle(st.id)}
                  className={`p-3.5 rounded-2xl text-left border transition-all ${
                    style === st.id
                      ? 'bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/20 ring-1 ring-amber-400/50'
                      : 'bg-slate-900/60 border-amber-500/20 hover:border-amber-400/40 text-amber-100/80'
                  }`}
                >
                  <div className="font-bold text-sm text-amber-100 flex items-center justify-between">
                    <span>{st.label}</span>
                    {style === st.id && <Check className="w-4 h-4 text-amber-400" />}
                  </div>
                  <div className="text-[11px] text-amber-200/60 mt-1">{st.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Colors */}
          <div>
            <h3 className="text-base font-chakra font-bold gold-gradient-text mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center border border-amber-400/40">2</span>
              เลือกโทนสีตกแต่ง
            </h3>

            <div className="flex flex-wrap gap-2.5">
              {COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
                    color === c.id
                      ? 'bg-slate-800 border-amber-400 text-amber-200 ring-2 ring-amber-400/40 shadow-md'
                      : 'bg-slate-900/80 border-amber-500/20 text-slate-300 hover:border-amber-400/30'
                  }`}
                >
                  <span className="w-3.5 h-3.5 rounded-full border border-white/30" style={{ backgroundColor: c.hex }} />
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Decorations Toggle */}
          <div>
            <h3 className="text-base font-chakra font-bold gold-gradient-text mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center border border-amber-400/40">3</span>
              ของตกแต่งมงคล (เปิด / ปิด)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { key: 'flowers', label: '🌸 ดอกไม้' },
                { key: 'jossSticks', label: '🕯️ ธูป' },
                { key: 'candle', label: '🔥 เทียน' },
                { key: 'lotusPetals', label: '🪷 กลีบดอกบัว' },
                { key: 'sparkles', label: '✨ พลุประกายแสง' },
              ].map((item) => {
                const isChecked = decorations[item.key as keyof KrathongDecorations];
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => toggleDecoration(item.key as keyof KrathongDecorations)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-between transition-colors ${
                      isChecked
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                        : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${isChecked ? 'bg-amber-400 text-slate-950 font-bold' : 'border border-slate-600'}`}>
                      {isChecked && '✓'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Wish Section */}
          <div className="pt-3 border-t border-amber-500/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-chakra font-bold gold-gradient-text flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center border border-amber-400/40">4</span>
                คำอธิษฐานในคืนวันเพ็ญ
              </h3>

              {/* AI Polish Button */}
              <button
                type="button"
                onClick={handleAiPolishWish}
                disabled={isAiLoading}
                className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-md transition-all disabled:opacity-50"
              >
                {isAiLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5 text-amber-300" />}
                <span>ให้ AI ช่วยเกลาคำอธิษฐาน</span>
              </button>
            </div>

            {/* Textarea */}
            <textarea
              value={wish}
              onChange={(e) => setWish(e.target.value.slice(0, maxChars))}
              rows={3}
              placeholder="ขอให้สุขภาพแข็งแรง มีความสุข และประสบความสำเร็จในทุกด้าน"
              className="w-full p-3.5 rounded-2xl bg-slate-900/90 border border-amber-500/40 text-amber-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm leading-relaxed"
            />

            {/* Character Count */}
            <div className="flex justify-between items-center mt-1 text-[11px] text-amber-200/60">
              <span>สามารถเขียนได้ไม่เกิน {maxChars} ตัวอักษร</span>
              <span className={remainingChars < 20 ? 'text-amber-400 font-bold' : ''}>
                เหลือ {remainingChars} ตัวอักษร
              </span>
            </div>

            {/* Quick Wish Presets */}
            <div className="mt-3">
              <span className="text-[11px] text-amber-300/70 mb-1.5 block flex items-center gap-1">
                <HeartHandshake className="w-3 h-3 text-amber-400" />
                คำอธิษฐานแนะนำ (คลิกเพื่อเลือกใช้งาน):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_WISHES.map((pw, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setWish(pw)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900/70 hover:bg-amber-500/20 border border-amber-500/20 text-amber-200/80 text-[11px] transition-colors truncate max-w-[260px]"
                  >
                    {pw}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Golden Launch Krathong Button */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full mt-6 py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-chakra font-extrabold text-lg flex items-center justify-center gap-2 shadow-2xl shadow-amber-500/40 hover:shadow-amber-500/60 transition-all duration-300 active:scale-[0.98]"
          >
            <Sparkles className="w-5 h-5" />
            <span>นำกระทงลงสู่สายน้ำ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
