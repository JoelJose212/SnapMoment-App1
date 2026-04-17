import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';
import { useVIPStore } from '../store/vipStore';

export interface QueueItem {
  id: string;
  uri: string;
  eventId: string;
  vectors: number[][];
  fileName: string;
  retryCount: number;
  status: 'pending' | 'uploading' | 'failed';
}

const QUEUE_STORAGE_KEY = '@snapmoment_upload_queue';

export const getQueue = async (): Promise<QueueItem[]> => {
  const data = await AsyncStorage.getItem(QUEUE_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveQueue = async (queue: QueueItem[]) => {
  await AsyncStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
};

export const addToQueue = async (item: Omit<QueueItem, 'status' | 'retryCount' | 'id'>) => {
  const queue = await getQueue();
  const newItem: QueueItem = {
    ...item,
    id: Math.random().toString(36).substring(7),
    status: 'pending',
    retryCount: 0,
  };
  await saveQueue([...queue, newItem]);
};

export const removeFromQueue = async (id: string) => {
  const queue = await getQueue();
  await saveQueue(queue.filter(i => i.id !== id));
};

export const updateQueueItem = async (updatedItem: QueueItem) => {
  const queue = await getQueue();
  await saveQueue(queue.map(i => i.id === updatedItem.id ? updatedItem : i));
};

/**
 * Cosine Similarity Calculation
 */
const calculateSimilarity = (vec1: number[], vec2: number[]): number => {
  let dotProduct = 0, norm1 = 0, norm2 = 0;
  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    norm1 += vec1[i] * vec1[i];
    norm2 += vec2[i] * vec2[i];
  }
  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
};

/**
 * VIP Matching during sync
 */
const processVIPMatching = async (item: QueueItem) => {
  const vips = useVIPStore.getState().getVIPsByEvent(item.eventId);
  if (vips.length === 0 || item.vectors.length === 0) return;

  for (const guest of vips) {
    for (const faceVec of item.vectors) {
      const score = calculateSimilarity(faceVec, guest.vector);
      if (score >= 0.85) {
        useVIPStore.getState().updateLastSeen(guest.id, Date.now());
        break;
      }
    }
  }
};

/**
 * Background Sync Logic
 */
let isSyncing = false;

export const startSync = async (onProgress?: (count: number) => void) => {
  if (isSyncing) return;
  isSyncing = true;

  const process = async () => {
    const queue = await getQueue();
    const pending = queue.filter(i => i.status !== 'uploading');
    
    if (onProgress) onProgress(pending.length);
    if (pending.length === 0) {
      isSyncing = false;
      return;
    }

    const next = pending[0];
    next.status = 'uploading';
    await updateQueueItem(next);

    try {
      const formData = new FormData();
      // @ts-ignore
      formData.append('files', {
        uri: next.uri,
        type: 'image/jpeg',
        name: next.fileName,
      });
      formData.append('vectors', JSON.stringify(next.vectors));

      await processVIPMatching(next);
      await api.post(`/api/events/${next.eventId}/photos`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await removeFromQueue(next.id);
      setTimeout(process, 500);
    } catch (err) {
      console.error(`Sync failure for ${next.fileName}:`, err);
      next.status = 'failed';
      next.retryCount += 1;
      
      if (next.retryCount > 3) {
        await removeFromQueue(next.id);
      } else {
        await updateQueueItem(next);
      }
      setTimeout(process, 5000);
    }
  };

  process();
};
