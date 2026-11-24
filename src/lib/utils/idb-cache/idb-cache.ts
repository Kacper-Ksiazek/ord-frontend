import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import { buildIdbCacheEntry, isIdbCacheEntryFresh, type IdbCacheEntry } from './idb-cache.utils';

const DB_NAME = 'ord_app_cache';
const DB_VERSION = 1;
const STORE = 'entries';

interface CacheSchema extends DBSchema {
	[STORE]: {
		key: string;
		value: IdbCacheEntry<unknown>;
	};
}

let dbPromise: Promise<IDBPDatabase<CacheSchema> | null> | null = null;

/** Opens the cache DB once; resolves to `null` when IndexedDB is unavailable (SSR, private mode). */
function getDb(): Promise<IDBPDatabase<CacheSchema> | null> {
	if (typeof indexedDB === 'undefined') {
		return Promise.resolve(null);
	}

	dbPromise ??= openDB<CacheSchema>(DB_NAME, DB_VERSION, {
		upgrade(db) {
			db.createObjectStore(STORE, { keyPath: 'key' });
		}
	}).catch((error: unknown) => {
		console.error('Error opening IndexedDB cache:', error);
		dbPromise = null;

		return null;
	});

	return dbPromise;
}

/**
 * Reads a cached value. Returns `null` when it is missing, expired (expired entries are
 * removed), or IndexedDB fails — the cache is best effort and never throws.
 */
export async function getIdbCacheValue<T>(key: string, now = Date.now()): Promise<T | null> {
	try {
		const db = await getDb();
		const entry = await db?.get(STORE, key);

		if (isIdbCacheEntryFresh(entry, now)) {
			return entry.value as T;
		}

		if (entry) {
			await db?.delete(STORE, key);
		}

		return null;
	} catch (error) {
		console.error('Error reading IndexedDB cache:', error);

		return null;
	}
}

export async function setIdbCacheValue<T>(
	key: string,
	value: T,
	ttlMs: number,
	now = Date.now()
): Promise<void> {
	try {
		const db = await getDb();

		await db?.put(STORE, buildIdbCacheEntry(key, value, ttlMs, now));
	} catch (error) {
		console.error('Error writing IndexedDB cache:', error);
	}
}

/** Removes every cached entry (e.g. on logout, since entries are user specific). */
export async function clearIdbCache(): Promise<void> {
	try {
		const db = await getDb();

		await db?.clear(STORE);
	} catch (error) {
		console.error('Error clearing IndexedDB cache:', error);
	}
}
