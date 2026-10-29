import { KrathongData } from '../types';

export const INITIAL_KRATHONGS: KrathongData[] = [
  {
    id: 'k-101',
    nickname: 'พี่นพ',
    department: 'ฝ่ายไอทีและนวัตกรรม V45',
    style: 'golden_lotus',
    color: 'gold',
    decorations: { flowers: true, jossSticks: true, candle: true, lotusPetals: true, sparkles: true },
    wish: 'ขอให้ระบบของ V45 เสถียร ราบรื่นไร้บั๊ก ทีมงานทุกคนมีสุขภาพแข็งแรง และองค์กรก้าวไกลอย่างยั่งยืนครับ',
    timestamp: Date.now() - 3600000 * 2,
    xPercent: 18,
    speed: 0.015,
    likes: 24
  },
  {
    id: 'k-102',
    nickname: 'น้องฟ้า',
    department: 'ฝ่ายทรัพยากรบุคคล (HR)',
    style: 'lotus',
    color: 'pink',
    decorations: { flowers: true, jossSticks: true, candle: true, lotusPetals: true, sparkles: true },
    wish: 'ขอให้พนักงาน V45 ทุกคนทำงานอย่างมีความสุข สุขภาพกายใจสมบูรณ์ บรรยากาศในองค์กรเต็มไปด้วยรอยยิ้มค่ะ',
    timestamp: Date.now() - 3600000 * 5,
    xPercent: 38,
    speed: 0.012,
    likes: 19
  },
  {
    id: 'k-103',
    nickname: 'บอสวิชัย',
    department: 'คณะผู้บริหาร V45',
    style: 'golden_lotus',
    color: 'gold',
    decorations: { flowers: true, jossSticks: true, candle: true, lotusPetals: true, sparkles: true },
    wish: 'ขอขอบคุณพนักงาน V45 ทุกท่านที่ร่วมแรงร่วมใจ ขอให้ครอบครัวของทุกคนมีความสุข ความเจริญก้าวหน้าอย่างมั่นคง',
    timestamp: Date.now() - 3600000 * 1,
    xPercent: 55,
    speed: 0.018,
    likes: 42
  },
  {
    id: 'k-104',
    nickname: 'ปอนด์',
    department: 'ฝ่ายการตลาด V45',
    style: 'traditional',
    color: 'emerald',
    decorations: { flowers: true, jossSticks: true, candle: true, lotusPetals: true, sparkles: false },
    wish: 'ขอให้แคมเปญส่งท้ายปีของ V45 ทะลุเป้า ยอดขายเติบโตก้าวกระโดด และลูกค้าประทับใจในบริการของเราครับ',
    timestamp: Date.now() - 3600000 * 8,
    xPercent: 72,
    speed: 0.014,
    likes: 15
  },
  {
    id: 'k-105',
    nickname: 'ต่าย & ทีมงาน',
    department: 'ฝ่ายปฏิบัติการ V45',
    style: 'eco_coconut',
    color: 'purple',
    decorations: { flowers: true, jossSticks: true, candle: true, lotusPetals: false, sparkles: true },
    wish: 'ขอให้การขนส่งและงานปฏิบัติการทุกภาคส่วนเป็นไปอย่างราบรื่น ไม่มีอุปสรรค ขอให้ทุกคนเดินทางปลอดภัยเสมอค่ะ',
    timestamp: Date.now() - 3600000 * 12,
    xPercent: 86,
    speed: 0.011,
    likes: 31
  },
  {
    id: 'k-106',
    nickname: 'คุณเมย์',
    department: 'ฝ่ายบัญชีและการเงิน',
    style: 'lotus',
    color: 'blue',
    decorations: { flowers: true, jossSticks: true, candle: true, lotusPetals: true, sparkles: true },
    wish: 'ขอให้การเงิน V45 มั่งคั่ง มั่นคง ตัวเลขสมดุลลงตัว และทุกคนรับโบนัสก้อนโตปลายปีนี้ค่ะ!',
    timestamp: Date.now() - 3600000 * 4,
    xPercent: 28,
    speed: 0.016,
    likes: 27
  }
];

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
    if (!raw) return 1428 + getStoredKrathongs().length - INITIAL_KRATHONGS.length;
    return parseInt(raw, 10) || 1428;
  } catch {
    return 1428;
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
