export type KrathongStyle = 'traditional' | 'lotus' | 'golden_lotus' | 'eco_coconut';

export type KrathongColor = 'gold' | 'pink' | 'blue' | 'purple' | 'emerald';

export interface KrathongDecorations {
  flowers: boolean;
  jossSticks: boolean;
  candle: boolean;
  lotusPetals: boolean;
  sparkles: boolean;
}

export interface KrathongData {
  id: string;
  nickname: string;
  department: string;
  style: KrathongStyle;
  color: KrathongColor;
  decorations: KrathongDecorations;
  wish: string;
  timestamp: number;
  xPercent: number; // 5% to 95% across screen
  speed: number;    // floating drift speed
  likes: number;
}

export type AppStep = 'welcome' | 'customize' | 'floating' | 'result' | 'river';
