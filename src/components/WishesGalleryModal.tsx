import React, { useState } from 'react';
import { KrathongData } from '../types';
import { KrathongGraphic } from './KrathongGraphic';
import { X, Heart, Search, Sparkles, MessageSquare, LayoutGrid } from 'lucide-react';

interface WishesGalleryModalProps {
  krathongs: KrathongData[];
  onClose: () => void;
  onLikeKrathong: (id: string) => void;
  onSelectKrathong: (krathong: KrathongData) => void;
}

export const WishesGalleryModal: React.FC<WishesGalleryModalProps> = ({
  krathongs,
  onClose,
  onLikeKrathong,
  onSelectKrathong,
}) => {
  const [activeTab, setActiveTab] = useState<'gallery' | 'wishes'>('gallery');
  const [search, setSearch] = useState('');

  const filtered = krathongs.filter((k) => {
    const searchLower = search.toLowerCase();
    return (
      k.nickname.toLowerCase().includes(searchLower) ||
      k.wish.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl h-[85vh] glass-panel-gold rounded-3xl p-6 border border-amber-400/50 shadow-2xl flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-500/20">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-chakra font-bold text-lg text-white">แกลเลอรี & คำอธิษฐานพนักงาน V45</h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-amber-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab & Search Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between my-4">
          {/* Segmented Tab Controls */}
          <div className="flex p-1 bg-slate-900/80 rounded-xl border border-amber-500/30 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'gallery'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-amber-200 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>แกลเลอรี กระทง</span>
            </button>

            <button
              onClick={() => setActiveTab('wishes')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'wishes'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-amber-200 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>บอร์ดคำอธิษฐาน</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาชื่อ หรือคำอธิษฐาน..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/90 border border-amber-500/30 text-amber-100 placeholder-slate-400 text-xs focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto pr-2 my-2">
          {filtered.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-amber-200/50 text-xs">
              <MessageSquare className="w-8 h-8 mb-2 opacity-40" />
              <span>ไม่พบข้อมูลที่ค้นหา</span>
            </div>
          ) : activeTab === 'gallery' ? (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectKrathong(item)}
                  className="glass-panel p-4 rounded-2xl border border-amber-500/20 hover:border-amber-400/50 transition-all cursor-pointer group flex flex-col items-center text-center shadow-lg"
                >
                  <div className="transform group-hover:scale-105 transition-transform my-2">
                    <KrathongGraphic
                      style={item.style}
                      color={item.color}
                      decorations={item.decorations}
                      size={130}
                    />
                  </div>

                  <div className="font-bold text-sm text-white">{item.nickname}</div>
                  <div className="text-xs text-amber-200/70 italic font-sarabun line-clamp-2 my-2">
                    "{item.wish}"
                  </div>

                  <div className="mt-auto w-full pt-2 border-t border-amber-500/10 flex justify-between items-center text-[11px] text-amber-300/60">
                    <span>{new Date(item.timestamp).toLocaleDateString('th-TH')}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onLikeKrathong(item.id);
                      }}
                      className="flex items-center gap-1 text-pink-400 hover:text-pink-300 font-bold"
                    >
                      <Heart className="w-3.5 h-3.5 fill-pink-400" />
                      <span>{item.likes || 0}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Wishes List View */
            <div className="space-y-3">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="glass-panel p-4 rounded-2xl border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="shrink-0 cursor-pointer" onClick={() => onSelectKrathong(item)}>
                      <KrathongGraphic
                        style={item.style}
                        color={item.color}
                        decorations={item.decorations}
                        size={75}
                      />
                    </div>

                    <div>
                      <span className="font-bold text-sm text-amber-200">{item.nickname}</span>
                      <p className="text-xs text-amber-100/90 font-sarabun italic mt-1 leading-relaxed">
                        "{item.wish}"
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onLikeKrathong(item.id)}
                    className="px-3 py-1.5 rounded-full bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/40 text-pink-300 text-xs font-bold flex items-center gap-1.5 shrink-0 self-end sm:self-center transition-colors"
                  >
                    <Heart className="w-3.5 h-3.5 fill-pink-400" />
                    <span>{item.likes || 0}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
