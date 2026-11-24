import { describe, expect, it } from 'vitest';
import { LruCache } from './lru-cache';

describe('LruCache', () => {
	describe('positive path', () => {
		it('should return a stored value', () => {
			const cache = new LruCache<string>(2);

			cache.set('a', 'A');

			expect(cache.get('a')).toBe('A');
		});
	});

	describe('negative path', () => {
		it('should return undefined for a missing key', () => {
			const cache = new LruCache<string>(2);

			expect(cache.get('missing')).toBeUndefined();
		});
	});

	describe('edge cases', () => {
		it('should evict the least recently used entry when over the limit', () => {
			const cache = new LruCache<string>(2);

			cache.set('a', 'A');
			cache.set('b', 'B');
			cache.get('a');
			cache.set('c', 'C');

			expect(cache.get('b')).toBeUndefined();
			expect(cache.get('a')).toBe('A');
			expect(cache.get('c')).toBe('C');
		});

		it('should keep an empty-string value distinct from a missing one', () => {
			const cache = new LruCache<string>(2);

			cache.set('a', '');

			expect(cache.get('a')).toBe('');
		});
	});
});
