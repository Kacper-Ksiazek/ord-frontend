export interface IdbCacheEntry<T> {
	key: string;
	value: T;
	/** Epoch milliseconds after which the entry is stale. */
	expiresAt: number;
}

export function buildIdbCacheEntry<T>(
	key: string,
	value: T,
	ttlMs: number,
	now: number
): IdbCacheEntry<T> {
	return { key, value, expiresAt: now + ttlMs };
}

export function isIdbCacheEntryFresh(
	entry: IdbCacheEntry<unknown> | undefined,
	now: number
): entry is IdbCacheEntry<unknown> {
	return entry !== undefined && Number.isFinite(entry.expiresAt) && entry.expiresAt > now;
}
