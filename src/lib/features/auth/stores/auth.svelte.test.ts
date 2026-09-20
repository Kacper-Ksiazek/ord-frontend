import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { UserDTO } from '$auth/types';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '$lib/utils/local-storage';

vi.mock('$app/environment', () => ({
	browser: true
}));

const user: UserDTO = {
	id: '550e8400-e29b-41d4-a716-446655440000',
	email: 'user@example.com',
	name: 'Test User'
};

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

describe('authStore', () => {
	beforeEach(() => {
		vi.resetModules();
		vi.stubGlobal('localStorage', createMemoryLocalStorage());
	});

	describe('positive path', () => {
		it('should persist the user in the store and localStorage', async () => {
			const { authStore } = await import('./auth.svelte');

			authStore.setUser(user);

			expect(authStore.user).toEqual(user);
			expect(getStorageItem(STORAGE_KEYS.USER)).toEqual(user);
		});

		it('should report authenticated when a user is set', async () => {
			const { authStore } = await import('./auth.svelte');

			authStore.setUser(user);

			expect(authStore.isAuthenticated).toBe(true);

			authStore.clearUser();

			expect(authStore.isAuthenticated).toBe(false);
		});
	});

	describe('negative path', () => {
		it('should clear the user from the store and localStorage', async () => {
			const { authStore } = await import('./auth.svelte');
			authStore.setUser(user);

			authStore.clearUser();

			expect(authStore.user).toBeNull();
			expect(getStorageItem(STORAGE_KEYS.USER)).toBeNull();
		});
	});

	describe('edge cases', () => {
		it('should load a previously stored user', async () => {
			setStorageItem(STORAGE_KEYS.USER, user);
			const { authStore } = await import('./auth.svelte');

			authStore.loadUserFromStorage();

			expect(authStore.user).toEqual(user);
		});
	});
});
