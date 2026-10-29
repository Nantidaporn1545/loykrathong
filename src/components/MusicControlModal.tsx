import React, { useState, useEffect } from 'react';
import { musicSynth } from '../utils/audioSynth';
import { X, Volume2, VolumeX, Music, Play, Pause, Disc } from 'lucide-react';

interface MusicControlModalProps {
  onClose: () => void;
}

export const MusicControlModal: React.FC<MusicControlModalProps> = ({ onClose }) => {
  const [isPlaying, setIsPlaying] = useState(musicSynth.getIsPlaying());
  const [volume, setVolume] = useState(musicSynth.getVolume());

  useEffect(() => {
    const unsubscribe = musicSynth.subscribe(() => {
      setIsPlaying(musicSynth.getIsPlaying());
      setVolume(musicSynth.getVolume());
    });
    return unsubscribe;
  }, []);

  const handleTogglePlay = () => {
    musicSynth.togglePlay();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    musicSynth.setVolume(v);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md glass-panel-gold rounded-3xl p-6 sm:p-8 border border-amber-400/50 shadow-2xl cursor-default text-center"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-500/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-full bg-amber-500/20 text-amber-400 border border-amber-400/30">
              <Music className="w-5 h-5 animate-pulse" />
            </div>
            <div className="text-left">
              <h3 className="font-chakra font-bold text-lg text-white leading-tight">
                เสียงเพลงงานลอยกระทง V45
              </h3>
              <p className="text-xs text-amber-200/70">เพลงลอยกระทงประจำกิจกรรม V45 Corporate</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-amber-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Track Card */}
        <div className="my-6 p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30 flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center shadow-xl shadow-amber-500/30 relative">
            <Disc className={`w-10 h-10 text-slate-950 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
          </div>

          <div>
            <div className="font-chakra font-bold text-base text-amber-200">
              🎶 เพลงลอยกระทง (Loy Krathong Theme Song)
            </div>
            <p className="text-xs text-amber-300/70 mt-1">เสียงเพลงหลักสำหรับงานลอยกระทงองค์กร V45</p>
          </div>

          {/* Master Play Button */}
          <button
            onClick={handleTogglePlay}
            className={`w-full py-3.5 rounded-xl font-chakra font-bold text-base flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${
              isPlaying
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-amber-500/30'
                : 'bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 hover:from-amber-300 hover:to-amber-500'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5 fill-slate-950" />
                <span>หยุดเล่นเพลง</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-slate-950" />
                <span>เปิดเล่นเพลงลอยกระทง</span>
              </>
            )}
          </button>

          {/* Volume Control */}
          <div className="flex items-center gap-3 w-full pt-2">
            <button
              onClick={() => musicSynth.setVolume(volume > 0 ? 0 : 0.6)}
              className="text-amber-400 hover:text-amber-300 transition-colors shrink-0"
            >
              {volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full accent-amber-400 bg-slate-800 rounded-lg cursor-pointer"
            />
            <span className="text-xs font-mono text-amber-300 w-10 text-right">
              {Math.round(volume * 100)}%
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-amber-500/20 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-200 font-bold text-xs border border-amber-500/30 transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
