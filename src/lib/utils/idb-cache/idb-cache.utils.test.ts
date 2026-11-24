import { describe, expect, it } from 'vitest';
import { buildIdbCacheEntry, isIdbCacheEntryFresh } from './idb-cache.utils';

const DAY_MS = 24 * 60 * 60 * 1000;

describe('buildIdbCacheEntry', () => {
	describe('positive path', () => {
		it('should set expiresAt to now plus the ttl', () => {
			const entry = buildIdbCacheEntry('k', ['a'], DAY_MS, 1_000);

			expect(entry).toEqual({ key: 'k', value: ['a'], expiresAt: 1_000 + DAY_MS });
		});
	});
});

describe('isIdbCacheEntryFresh', () => {
	describe('positive path', () => {
		it('should treat an entry before its expiry as fresh', () => {
			const entry = buildIdbCacheEntry('k', 1, DAY_MS, 0);

			expect(isIdbCacheEntryFresh(entry, DAY_MS - 1)).toBe(true);
		});
	});

	describe('negative path', () => {
		it('should treat a missing entry as stale', () => {
			expect(isIdbCacheEntryFresh(undefined, 0)).toBe(false);
		});

		it('should treat an entry past its expiry as stale', () => {
			const entry = buildIdbCacheEntry('k', 1, DAY_MS, 0);

			expect(isIdbCacheEntryFresh(entry, DAY_MS + 1)).toBe(false);
		});
	});

	describe('edge cases', () => {
		it('should treat an entry exactly at its expiry as stale', () => {
			const entry = buildIdbCacheEntry('k', 1, DAY_MS, 0);

			expect(isIdbCacheEntryFresh(entry, DAY_MS)).toBe(false);
		});

		it('should treat a corrupted expiry as stale', () => {
			expect(isIdbCacheEntryFresh({ key: 'k', value: 1, expiresAt: Number.NaN }, 0)).toBe(false);
		});
	});
});
