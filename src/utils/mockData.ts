import { KrathongData } from '../types';

export const INITIAL_KRATHONGS: KrathongData[] = [];

const STORAGE_KEY = 'v45_loy_krathong_data_v1';
const COUNTER_KEY = 'v45_loy_krathong_counter_v1';

export function getStoredKrathongs(): KrathongData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_KRATHONGS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_KRATHONGS;
  } catch {
    return INITIAL_KRATHONGS;
  }
}

export function saveKrathong(newKrathong: KrathongData): KrathongData[] {
  const current = getStoredKrathongs();
  const updated = [newKrathong, ...current];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    const count = getStoredCounter();
    localStorage.setItem(COUNTER_KEY, String(count + 1));
  } catch {
    // ignore
  }
  return updated;
}

export function getStoredCounter(): number {
  try {
    const raw = localStorage.getItem(COUNTER_KEY);
    if (!raw) return getStoredKrathongs().length;
    return parseInt(raw, 10) || 0;
  } catch {
    return 0;
  }
}

export function incrementLike(id: string): KrathongData[] {
  const current = getStoredKrathongs();
  const updated = current.map(item => {
    if (item.id === id) {
      return { ...item, likes: (item.likes || 0) + 1 };
    }
    return item;
  });
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
  return updated;
}
