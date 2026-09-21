import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { UserDTO } from '$auth/types';

const { httpGetCurrentUser, environment } = vi.hoisted(() => ({
	httpGetCurrentUser: vi.fn(),
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

const user: UserDTO = {
	id: '550e8400-e29b-41d4-a716-446655440000',
	email: 'user@example.com',
	name: 'Test User'
};

describe('loadCurrentUser', () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
		environment.browser = true;
	});

	describe('positive path', () => {
		it('should return the user when /me succeeds', async () => {
			httpGetCurrentUser.mockResolvedValue(user);
			const { loadCurrentUser } = await import('./load-current-user');

			const result = await loadCurrentUser();

			expect(result).toEqual({ user });
		});
	});

	describe('negative path', () => {
		it('should return a null user when /me throws', async () => {
			httpGetCurrentUser.mockRejectedValue(new Error('unauthorized'));
			vi.spyOn(console, 'error').mockImplementation(() => {});
			const { loadCurrentUser } = await import('./load-current-user');

			const result = await loadCurrentUser();

			expect(result).toEqual({ user: null });
		});
	});

	describe('edge cases', () => {
		it('should return a null user without calling http when not in the browser', async () => {
			environment.browser = false;
			const { loadCurrentUser } = await import('./load-current-user');

			const result = await loadCurrentUser();

			expect(result).toEqual({ user: null });
			expect(httpGetCurrentUser).not.toHaveBeenCalled();
		});
	});
});
