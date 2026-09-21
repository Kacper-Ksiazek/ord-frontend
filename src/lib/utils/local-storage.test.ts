import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearAppStorage, getStorageItem, setStorageItem, STORAGE_KEYS } from './local-storage';

function createMemoryLocalStorage(): Storage {
	const store = new Map<string, string>();

	return {
		getItem: (key: string) => store.get(key) ?? null,
		setItem: (key: string, value: string) => {
			store.set(key, String(value));
		},
		removeItem: (key: string) => {
			store.delete(key);
		},
		clear: () => {
			store.clear();
		},
		key: (index: number) => [...store.keys()][index] ?? null,
		get length() {
			return store.size;
		}
	};
}

describe('clearAppStorage', () => {
	beforeEach(() => {
		vi.stubGlobal('localStorage', createMemoryLocalStorage());
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	describe('positive path', () => {
		it('should remove session keys on clearAppStorage', () => {
			setStorageItem(STORAGE_KEYS.USER, { id: 'user-1' });
			setStorageItem(STORAGE_KEYS.SESSION_INITIALIZED, true);
			setStorageItem(STORAGE_KEYS.THEME, 'dark');

			clearAppStorage();

			for (const key of Object.values(STORAGE_KEYS)) {
				expect(getStorageItem(key)).toBeNull();
			}
		});
	});

	describe('negative path', () => {
		it('should not throw when localStorage is unavailable', () => {
			vi.stubGlobal('localStorage', {
				removeItem: () => {
					throw new Error('unavailable');
				}
			});
			vi.spyOn(console, 'error').mockImplementation(() => {});

			expect(() => clearAppStorage()).not.toThrow();
		});
	});

	describe('edge cases', () => {
		it('should leave unrelated localStorage keys intact', () => {
			localStorage.setItem('unrelated', 'keep');
			setStorageItem(STORAGE_KEYS.USER, { id: 'user-1' });

			clearAppStorage();

			expect(localStorage.getItem('unrelated')).toBe('keep');
			expect(getStorageItem(STORAGE_KEYS.USER)).toBeNull();
		});
	});
});
