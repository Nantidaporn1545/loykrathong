import {
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  increment,
  getDocs
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, testConnection } from '../lib/firebase';
import { KrathongData } from '../types';
import { INITIAL_KRATHONGS } from './mockData';

const COLLECTION_NAME = 'krathongs';

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

  const colRef = collection(db, COLLECTION_NAME);

  // Seed initially if empty
  seedInitialKrathongsIfEmpty().catch(() => {});

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

      if (items.length > 0) {
        onUpdate(items);
      } else {
        onUpdate(INITIAL_KRATHONGS);
      }
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
  const payload = {
    nickname: krathong.nickname,
    department: krathong.department || 'V45',
    style: krathong.style,
    color: krathong.color,
    decorations: krathong.decorations,
    wish: krathong.wish,
    timestamp: krathong.timestamp,
    xPercent: krathong.xPercent,
    speed: krathong.speed,
    likes: krathong.likes || 1
  };

  try {
    await setDoc(docRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTION_NAME}/${krathong.id}`);
  }
}

// Increment likes on a Krathong in Firestore
export async function incrementKrathongLikeInFirestore(krathongId: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, krathongId);
  try {
    await updateDoc(docRef, {
      likes: increment(1)
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${krathongId}`);
  }
}
