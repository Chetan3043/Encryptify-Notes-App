import { openDB } from 'idb';
import type { EncryptedRecord } from './types';

const DB_NAME = 'secure-notes-db';
const STORE_NAME = 'encrypted-notes';
const DB_VERSION = 1;

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    }
  },
});

export const getEncryptedRecords = async (): Promise<EncryptedRecord[]> => {
  const db = await dbPromise;
  return db.getAll(STORE_NAME);
};

export const saveEncryptedRecord = async (record: EncryptedRecord) => {
  const db = await dbPromise;
  await db.put(STORE_NAME, record);
};

export const deleteEncryptedRecord = async (id: string) => {
  const db = await dbPromise;
  await db.delete(STORE_NAME, id);
};

export const clearEncryptedStore = async () => {
  const db = await dbPromise;
  await db.clear(STORE_NAME);
};


