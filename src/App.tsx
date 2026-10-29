import { useState, useEffect } from 'react';
import { AppStep, KrathongData, KrathongStyle, KrathongColor, KrathongDecorations } from './types';
import { INITIAL_KRATHONGS } from './utils/mockData';
import {
  subscribeToKrathongs,
  addKrathongToFirestore,
  incrementKrathongLikeInFirestore
} from './utils/firebaseKrathongs';
import { musicSynth } from './utils/audioSynth';

import { RiverScene } from './components/RiverScene';
import { WelcomeScreen } from './components/WelcomeScreen';
import { KrathongCustomizer } from './components/KrathongCustomizer';
import { FloatingCeremony } from './components/FloatingCeremony';
import { ResultView } from './components/ResultView';
import { WishesGalleryModal } from './components/WishesGalleryModal';
import { MusicControlModal } from './components/MusicControlModal';

export default function App() {
  const [appStep, setAppStep] = useState<AppStep>('welcome');
  const [nickname, setNickname] = useState('');
  const [department] = useState('V45');

  const [krathongs, setKrathongs] = useState<KrathongData[]>(INITIAL_KRATHONGS);
  const [myKrathong, setMyKrathong] = useState<KrathongData | null>(null);
  const [counter, setCounter] = useState(1428);

  const [musicPlaying, setMusicPlaying] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [showMusicModal, setShowMusicModal] = useState(false);

  // Subscribe to real-time central Firestore database for all employees
  useEffect(() => {
    const unsubscribeFirestore = subscribeToKrathongs((realtimeList) => {
      setKrathongs(realtimeList);
      setCounter(1428 + realtimeList.length);
      
      // Keep myKrathong updated with latest likes if currently active
      if (myKrathong) {
        const found = realtimeList.find(k => k.id === myKrathong.id);
        if (found) {
          setMyKrathong(found);
        }
      }
    });

    const unsubscribeMusic = musicSynth.subscribe(() => {
      setMusicPlaying(musicSynth.getIsPlaying());
    });

    return () => {
      unsubscribeFirestore();
      unsubscribeMusic();
    };
  }, [myKrathong?.id]);

  // Handle music toggle
  const handleToggleMusic = () => {
    const playing = musicSynth.togglePlay();
    setMusicPlaying(playing);
  };

  // Step 1 -> Step 2
  const handleStartCustomize = (inputName: string) => {
    setNickname(inputName);
    setAppStep('customize');
  };

  // Submit custom Krathong -> Launch Ceremony & Sync to Central Database
  const handleSubmitKrathong = async (
    style: KrathongStyle,
    color: KrathongColor,
    decorations: KrathongDecorations,
    wish: string
  ) => {
    const newK: KrathongData = {
      id: `k-user-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      nickname,
      department,
      style,
      color,
      decorations,
      wish,
      timestamp: Date.now(),
      xPercent: 15 + Math.random() * 70, // random river X position
      speed: 0.012 + Math.random() * 0.005,
      likes: 1,
    };

    setMyKrathong(newK);
    
    // Launch ceremony view immediately
    musicSynth.playLaunchChime();
    setAppStep('floating');

    // Sync to Firestore central database for all employees to see
    try {
      await addKrathongToFirestore(newK);
    } catch (err) {
      console.error('Error adding krathong to Firestore:', err);
    }
  };

  // Floating Ceremony finished -> Show Result View
  const handleCeremonyComplete = () => {
    setAppStep('result');
  };

  // Handle Like in central database
  const handleLike = (id: string) => {
    // Optimistic local update
    setKrathongs(prev =>
      prev.map(k => (k.id === id ? { ...k, likes: (k.likes || 0) + 1 } : k))
    );
    if (myKrathong && myKrathong.id === id) {
      setMyKrathong(prev => prev ? { ...prev, likes: (prev.likes || 0) + 1 } : null);
    }

    // Update in Firestore
    incrementKrathongLikeInFirestore(id).catch(err => {
      console.error('Error incrementing like:', err);
    });
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#070b19] font-sarabun text-amber-50">
      {/* Background Interactive River Scene */}
      <div className="fixed inset-0 z-0 pointer-events-auto">
        <RiverScene
          krathongs={krathongs}
          activeKrathongId={myKrathong?.id}
          onLikeKrathong={handleLike}
          musicPlaying={musicPlaying}
          onToggleMusic={handleToggleMusic}
          onOpenMusicModal={() => setShowMusicModal(true)}
          onOpenGallery={() => setShowGalleryModal(true)}
          onOpenWishes={() => setShowGalleryModal(true)}
          totalCounter={counter}
          interactive={appStep !== 'floating'}
        />
      </div>

      {/* Foreground Interactive Overlay according to App Step */}
      <div className="relative z-10 min-h-screen pointer-events-none">
        {/* STEP 1: WELCOME SCREEN */}
        {appStep === 'welcome' && (
          <WelcomeScreen
            onStartCustomize={handleStartCustomize}
            onViewRiver={() => setAppStep('river')}
            totalParticipants={counter}
          />
        )}

        {/* STEP 2: KRATHONG CUSTOMIZER */}
        {appStep === 'customize' && (
          <KrathongCustomizer
            nickname={nickname}
            onBack={() => setAppStep('welcome')}
            onSubmitKrathong={handleSubmitKrathong}
          />
        )}

        {/* STEP 3: FLOATING CEREMONY (8-10 Seconds Animation) */}
        {appStep === 'floating' && myKrathong && (
          <FloatingCeremony
            krathong={myKrathong}
            onCeremonyComplete={handleCeremonyComplete}
          />
        )}

        {/* STEP 4: RESULT VIEW & CELEBRATIONS */}
        {appStep === 'result' && myKrathong && (
          <ResultView
            krathong={myKrathong}
            allKrathongs={krathongs}
            onLikeKrathong={handleLike}
            onOpenWishes={() => setShowGalleryModal(true)}
            onBackToRiver={() => setAppStep('river')}
            onReCreate={() => setAppStep('customize')}
          />
        )}
        {/* STEP 5: FULL INTERACTIVE RIVER VIEW (ชมสายน้ำกระทงพนักงาน) */}
        {appStep === 'river' && (
          <div className="fixed inset-x-0 bottom-6 z-40 flex flex-col items-center gap-3 px-4 pointer-events-none">
            {/* Interactive hint banner */}
            <div className="px-4 py-2 rounded-full glass-panel-gold border border-amber-400/50 text-amber-200 text-xs font-medium shadow-2xl flex items-center gap-2 animate-pulse pointer-events-auto">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>💡 คลิกที่กระทงใบใดก็ได้บนสายน้ำเพื่อเปิดอ่านคำอธิษฐานและส่งหัวใจให้เพื่อนๆ!</span>
            </div>

            {/* Quick action bar */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 p-2 rounded-2xl glass-panel-gold border border-amber-400/40 shadow-2xl pointer-events-auto">
              {myKrathong && (
                <button
                  onClick={() => setAppStep('result')}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 font-bold text-xs transition-colors"
                >
                  🏆 ผลการลอยของคุณ
                </button>
              )}

              <button
                onClick={() => setAppStep('customize')}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95"
              >
                ✨ สร้างกระทงใบใหม่
              </button>

              <button
                onClick={() => setAppStep('welcome')}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-amber-400/30 text-amber-200 text-xs transition-colors"
              >
                🏠 หน้าแรก
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 2: Corporate Wishes & Gallery Modal */}
      {showGalleryModal && (
        <div className="relative z-50">
          <WishesGalleryModal
            krathongs={krathongs}
            onClose={() => setShowGalleryModal(false)}
            onLikeKrathong={handleLike}
            onSelectKrathong={(k) => {
              setMyKrathong(k);
            }}
          />
        </div>
      )}

      {/* MODAL 3: Custom Audio Player & Song Settings */}
      {showMusicModal && (
        <div className="relative z-50">
          <MusicControlModal onClose={() => setShowMusicModal(false)} />
        </div>
      )}
    </div>
  );
}
