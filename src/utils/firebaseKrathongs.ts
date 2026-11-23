import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  increment,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, testConnection } from '../lib/firebase';
import { KrathongData } from '../types';
import { INITIAL_KRATHONGS } from './mockData';

const COLLECTION_NAME = 'krathongs_v2';
const VOTER_ID_STORAGE_KEY = 'v45_loy_krathong_voter_id_v2';
const LIKED_IDS_STORAGE_KEY = 'v45_loy_krathong_liked_ids_v2';

// Fallback in-memory storage if localStorage is unavailable
let memoryVoterId: string | null = null;
const memoryLikedIds = new Set<string>();

export function getOrCreateVoterId(): string {
  if (memoryVoterId) return memoryVoterId;

  try {
    const existing = localStorage.getItem(VOTER_ID_STORAGE_KEY);
    if (existing && /^[a-zA-Z0-9_-]{8,128}$/.test(existing)) {
      memoryVoterId = existing;
      return existing;
    }
  } catch {
    // ignore storage read errors
  }

  const randomPart =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().replace(/[^a-zA-Z0-9_-]/g, '')
      : `${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
  const newVoterId = `v45_${randomPart}`.slice(0, 128);
  memoryVoterId = newVoterId;

  try {
    localStorage.setItem(VOTER_ID_STORAGE_KEY, newVoterId);
  } catch {
    // ignore storage write errors
  }

  return newVoterId;
}

export function getLikedKrathongIds(): string[] {
  try {
    const raw = localStorage.getItem(LIKED_IDS_STORAGE_KEY);
    if (!raw) return Array.from(memoryLikedIds);
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const valid = parsed.filter((id): id is string => typeof id === 'string');
      valid.forEach((id) => memoryLikedIds.add(id));
      return valid;
    }
  } catch {
    // ignore storage errors
  }
  return Array.from(memoryLikedIds);
}

export function saveLikedKrathongId(krathongId: string): string[] {
  memoryLikedIds.add(krathongId);
  const updated = Array.from(memoryLikedIds);
  try {
    localStorage.setItem(LIKED_IDS_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore storage write errors
  }
  return updated;
}

export function removeLikedKrathongId(krathongId: string): string[] {
  memoryLikedIds.delete(krathongId);
  const updated = Array.from(memoryLikedIds);
  try {
    localStorage.setItem(LIKED_IDS_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore storage write errors
  }
  return updated;
}

// Seed initial company Krathongs if the Firestore database is completely empty
export async function seedInitialKrathongsIfEmpty() {
  const colRef = collection(db, COLLECTION_NAME);
  try {
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      console.log('Seeding initial Krathongs into Firestore...');
      for (const item of INITIAL_KRATHONGS) {
        await setDoc(doc(db, COLLECTION_NAME, item.id), item);
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
  }
}

// Subscribe to real-time Krathong stream from Firestore across all company users
export function subscribeToKrathongs(onUpdate: (krathongs: KrathongData[]) => void) {
  // Execute connection test on initialization
  testConnection();

  // Clear any legacy localStorage statistics so counts always reflect live central Firestore
  try {
    localStorage.removeItem('v45_loy_krathong_data_v1');
    localStorage.removeItem('v45_loy_krathong_counter_v1');
  } catch {
    // ignore storage errors
  }

  const colRef = collection(db, COLLECTION_NAME);

  const unsubscribe = onSnapshot(
    colRef,
    (snapshot) => {
      const items: KrathongData[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as KrathongData;
        items.push({
          ...data,
          id: docSnap.id
        });
      });

      // Sort by timestamp descending (newest first)
      items.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

      onUpdate(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
    }
  );

  return unsubscribe;
}

// Add a new Krathong to Firestore for real-time multi-user visibility
export async function addKrathongToFirestore(krathong: KrathongData): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, krathong.id);
  const safeNickname = (krathong.nickname || 'พนักงาน').trim().slice(0, 100) || 'พนักงาน';
  const safeDepartment = (krathong.department || 'V45').trim().slice(0, 100) || 'V45';
  const safeWish = (krathong.wish || '').slice(0, 1000);

  const payload = {
    nickname: safeNickname,
    department: safeDepartment,
    style: krathong.style,
    color: krathong.color,
    decorations: krathong.decorations,
    wish: safeWish,
    timestamp: krathong.timestamp,
    xPercent: krathong.xPercent,
    speed: krathong.speed,
    likes: Math.max(0, krathong.likes || 1)
  };

  try {
    await setDoc(docRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTION_NAME}/${krathong.id}`);
  }
}

// Increment likes on a Krathong in Firestore atomically (strictly once per voterId)
export async function incrementKrathongLikeInFirestore(krathongId: string): Promise<void> {
  const voterId = getOrCreateVoterId();
  const krathongDocRef = doc(db, COLLECTION_NAME, krathongId);
  const likeDocRef = doc(db, COLLECTION_NAME, krathongId, 'likes', voterId);

  const batch = writeBatch(db);
  batch.set(likeDocRef, {
    voterId,
    createdAt: Date.now()
  });
  batch.update(krathongDocRef, {
    likes: increment(1)
  });

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${krathongId}`);
  }
}

// Reset all Krathong data in Firestore back to initial fresh state
export async function resetAllKrathongsInFirestore(): Promise<void> {
  const colRef = collection(db, COLLECTION_NAME);
  try {
    const snapshot = await getDocs(colRef);
    const deletePromises = snapshot.docs.map((docSnap) =>
      deleteDoc(doc(db, COLLECTION_NAME, docSnap.id))
    );
    await Promise.all(deletePromises);

    // Clear local storage keys
    try {
      localStorage.removeItem('v45_loy_krathong_data_v1');
      localStorage.removeItem('v45_loy_krathong_counter_v1');
    } catch {}

    // Seed default sample krathongs
    for (const item of INITIAL_KRATHONGS) {
      await setDoc(doc(db, COLLECTION_NAME, item.id), item);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, COLLECTION_NAME);
  }
}
