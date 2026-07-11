import { openDB, type IDBPDatabase } from 'idb';
import type { Prompt } from '../types';

const DB_NAME = 'promptvault';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<unknown>> | null = null;

function getDb(): Promise<IDBPDatabase<unknown>> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('prompts')) {
          const store = db.createObjectStore('prompts', { keyPath: 'id' });
          store.createIndex('updated_at', 'updated_at');
          store.createIndex('is_favorite', 'is_favorite');
          store.createIndex('platform', 'platform');
        }
        if (!db.objectStoreNames.contains('pending_sync')) {
          db.createObjectStore('pending_sync', { keyPath: 'id', autoIncrement: true });
        }
      },
    });
  }
  return dbPromise;
}

export async function cachePrompts(prompts: Prompt[]): Promise<void> {
  const db = await getDb();
  const tx = db.transaction('prompts', 'readwrite');
  for (const p of prompts) {
    await tx.store.put(p);
  }
  await tx.done;
}

export async function getCachedPrompts(): Promise<Prompt[]> {
  const db = await getDb();
  const prompts = await db.getAll('prompts');
  return prompts.sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
}

export async function addPendingSync(operation: 'create' | 'update' | 'delete', prompt: Partial<Prompt>): Promise<void> {
  const db = await getDb();
  await db.add('pending_sync', { operation, prompt, timestamp: new Date().toISOString() });
}

export async function getPendingSyncs(): Promise<any[]> {
  const db = await getDb();
  return db.getAll('pending_sync');
}

export async function clearPendingSyncs(): Promise<void> {
  const db = await getDb();
  await db.clear('pending_sync');
}

export async function syncOfflineChanges(
  syncFn: (ops: any[]) => Promise<void>
): Promise<void> {
  const pending = await getPendingSyncs();
  if (pending.length === 0) return;
  try {
    await syncFn(pending);
    await clearPendingSyncs();
  } catch {
    // Will retry on next sync
  }
}