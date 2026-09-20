import { beforeEach, describe, expect, it, vi } from 'vitest';
import { STORAGE_KEYS } from '$lib/utils/local-storage';

const { goto, getStorageItem, setStorageItem } = vi.hoisted(() => ({
	goto: vi.fn(),
	getStorageItem: vi.fn(),
	setStorageItem: vi.fn()
}));

vi.mock('$app/navigation', () => ({
	goto
}));

vi.mock('$lib/utils/local-storage', async (importOriginal) => {
	const actual = await importOriginal<typeof import('$lib/utils/local-storage')>();

	return {
		...actual,
		getStorageItem,
		setStorageItem
	};
});

describe('ensureSessionOnNavigate', () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	describe('positive path', () => {
		it('should not redirect when a stored user is present on a private path', async () => {
			getStorageItem.mockReturnValue({ id: 'user-1' });
			vi.stubGlobal('window', { location: { pathname: '/conversations' } });
			const { ensureSessionOnNavigate } = await import('./ensure-session');

			ensureSessionOnNavigate();

			expect(goto).not.toHaveBeenCalled();
			expect(setStorageItem).toHaveBeenCalledWith(STORAGE_KEYS.SESSION_INITIALIZED, true);
		});
	});

	describe('negative path', () => {
		it('should redirect to login when no user is stored on a private path', async () => {
			getStorageItem.mockReturnValue(null);
			vi.stubGlobal('window', { location: { pathname: '/conversations' } });
			const { ensureSessionOnNavigate } = await import('./ensure-session');

			ensureSessionOnNavigate();

			expect(goto).toHaveBeenCalledWith('/login');
		});
	});

	describe('edge cases', () => {
		it('should not redirect when the path starts with /login and no user is stored', async () => {
			getStorageItem.mockReturnValue(null);
			vi.stubGlobal('window', { location: { pathname: '/login' } });
			const { ensureSessionOnNavigate } = await import('./ensure-session');

			ensureSessionOnNavigate();

			expect(goto).not.toHaveBeenCalled();
		});
	});
});
