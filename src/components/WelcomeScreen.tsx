import React, { useState } from 'react';
import { Sparkles, ArrowRight, User, Heart, Eye } from 'lucide-react';

interface WelcomeScreenProps {
  onStartCustomize: (nickname: string) => void;
  onViewRiver: () => void;
  totalParticipants: number;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStartCustomize,
  onViewRiver,
  totalParticipants,
}) => {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) {
      setError('กรุณากรอกชื่อเล่นของคุณก่อนเริ่มตกแต่งกระทง');
      return;
    }
    setError('');
    onStartCustomize(nickname.trim());
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between p-4 md:p-8 z-10">
      {/* Top Corporate Badge */}
      <div className="w-full max-w-4xl flex justify-between items-center pt-2">
        <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-panel border border-amber-500/30">
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 flex items-center justify-center font-bold text-[10px] text-slate-950">
            V45
          </div>
          <span className="text-xs text-amber-200/90 font-medium">องค์กร V45 Corporate Events</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-amber-300/80 font-chakra">
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          <span>ลอยกระทงร่วมกัน <strong className="text-amber-300 font-bold">{totalParticipants.toLocaleString()}</strong> คน</span>
        </div>
      </div>

      {/* Hero Central Content Card */}
      <div className="my-auto w-full max-w-lg glass-panel-gold rounded-3xl p-6 sm:p-8 md:p-10 text-center shadow-2xl relative border border-amber-400/40 pointer-events-auto">
        {/* Decorative Floating Moon Beam Accent */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-gradient-to-b from-amber-200/30 to-amber-500/10 blur-xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          ประเพณีลอยกระทงประจำปี V45
        </div>

        {/* Title */}
        <h1 className="font-chakra text-3xl sm:text-4xl md:text-5xl font-extrabold gold-gradient-text tracking-wide mb-3 leading-tight">
          กิจกรรมลอยกระทงออนไลน์ V45
        </h1>

        {/* Welcome Subtitle */}
        <p className="text-amber-100/90 font-sarabun text-sm sm:text-base leading-relaxed mb-8">
          ร่วมสืบสานประเพณีไทย ส่งต่อความสุขและคำอธิษฐานในคืนวันเพ็ญ
        </p>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Nickname Input */}
          <div>
            <label className="block text-xs font-medium text-amber-200 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-400" />
              ชื่อเล่นพนักงาน <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                if (error) setError('');
              }}
              placeholder="กรุณากรอกชื่อเล่น"
              maxLength={30}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-amber-500/40 text-amber-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/80 focus:border-transparent text-sm transition-all"
            />
          </div>

          {error && <p className="text-rose-400 text-xs font-medium">{error}</p>}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-chakra font-bold text-base flex items-center justify-center gap-2 shadow-xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300 active:scale-[0.98]"
            >
              <span>เริ่มตกแต่งกระทง</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={onViewRiver}
              className="py-3.5 px-5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-amber-400/50 text-amber-300 hover:text-amber-200 font-chakra font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all duration-300 active:scale-[0.98] shrink-0"
            >
              <Eye className="w-4 h-4 text-amber-400" />
              <span>ชมสายน้ำลอยกระทง</span>
            </button>
          </div>
        </form>
      </div>

      {/* Footer copyright */}
      <footer className="text-center py-4 text-xs text-amber-300/50">
        © 2026 V45 Corporate Events · สืบสานวัฒนธรรมไทยด้วยความภาคภูมิใจ
      </footer>
    </div>
  );
};

