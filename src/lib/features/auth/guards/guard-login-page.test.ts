import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { UserDTO } from '$auth/types';
import { STORAGE_KEYS } from '$lib/utils/local-storage';

const { httpGetCurrentUser, redirect, environment } = vi.hoisted(() => ({
	httpGetCurrentUser: vi.fn(),
	redirect: vi.fn(),
	environment: { browser: true }
}));

vi.mock('$app/environment', () => ({
	get browser() {
		return environment.browser;
	}
}));

vi.mock('$auth/api-client/api', () => ({
	httpGetCurrentUser
}));

vi.mock('@sveltejs/kit', () => ({
	redirect
}));

const storedUser: UserDTO = {
	id: '550e8400-e29b-41d4-a716-446655440000',
	email: 'user@example.com',
	name: 'Stored User'
};

const confirmedUser: UserDTO = {
	...storedUser,
	name: 'Confirmed User'
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

describe('loadLoginPage', () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
		environment.browser = true;
		vi.stubGlobal('localStorage', createMemoryLocalStorage());
		redirect.mockImplementation(() => {
			throw new Error('redirect');
		});
	});

	describe('positive path', () => {
		it('should redirect home when /me confirms the stored user', async () => {
			const { setStorageItem, getStorageItem } = await import('$lib/utils/local-storage');
			setStorageItem(STORAGE_KEYS.USER, storedUser);
			httpGetCurrentUser.mockResolvedValue(confirmedUser);
			const { loadLoginPage } = await import('./guard-login-page');

			await expect(loadLoginPage()).rejects.toThrow('redirect');

			expect(httpGetCurrentUser).toHaveBeenCalledOnce();
			expect(redirect).toHaveBeenCalledWith(307, '/');
			expect(getStorageItem(STORAGE_KEYS.USER)).toEqual(confirmedUser);
		});
	});

	describe('negative path', () => {
		it('should clear the stored user and stay on login when /me fails', async () => {
			const { setStorageItem, getStorageItem } = await import('$lib/utils/local-storage');
			setStorageItem(STORAGE_KEYS.USER, storedUser);
			setStorageItem(STORAGE_KEYS.THEME, 'dark');
			httpGetCurrentUser.mockRejectedValue(new Error('unauthorized'));
			vi.spyOn(console, 'error').mockImplementation(() => {});
			const { loadLoginPage } = await import('./guard-login-page');

			await loadLoginPage();

			expect(redirect).not.toHaveBeenCalled();
			expect(getStorageItem(STORAGE_KEYS.USER)).toBeNull();
			expect(getStorageItem(STORAGE_KEYS.THEME)).toBe('dark');
		});
	});

	describe('edge cases', () => {
		it('should not call /me when no user is stored', async () => {
			const { loadLoginPage } = await import('./guard-login-page');

			await loadLoginPage();

			expect(httpGetCurrentUser).not.toHaveBeenCalled();
			expect(redirect).not.toHaveBeenCalled();
		});

		it('should not call /me outside the browser', async () => {
			environment.browser = false;
			const { setStorageItem } = await import('$lib/utils/local-storage');
			setStorageItem(STORAGE_KEYS.USER, storedUser);
			const { loadLoginPage } = await import('./guard-login-page');

			await loadLoginPage();

			expect(httpGetCurrentUser).not.toHaveBeenCalled();
			expect(redirect).not.toHaveBeenCalled();
		});
	});
});
