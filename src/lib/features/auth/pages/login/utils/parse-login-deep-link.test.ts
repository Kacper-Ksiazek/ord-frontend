import { describe, expect, it } from 'vitest';
import { loginDeepLinkKey, parseLoginDeepLink } from './parse-login-deep-link';

describe('parseLoginDeepLink', () => {
	describe('positive path', () => {
		it('should read a valid email and a 6-digit code', () => {
			const params = new URLSearchParams('email=user%40example.com&code=123456');

			const result = parseLoginDeepLink(params);

			expect(result).toEqual({ email: 'user@example.com', code: '123456' });
		});

		it('should keep a plus-address after decoding', () => {
			const params = new URLSearchParams('email=user%2Btag%40example.com&code=012345');

			const result = parseLoginDeepLink(params);

			expect(result).toEqual({ email: 'user+tag@example.com', code: '012345' });
		});
	});

	describe('negative path', () => {
		it('should ignore an email without @', () => {
			const params = new URLSearchParams('email=not-an-email&code=123456');

			const result = parseLoginDeepLink(params);

			expect(result).toEqual({ email: null, code: '123456' });
		});

		it('should ignore a code that is not exactly 6 digits', () => {
			const params = new URLSearchParams('email=user@example.com&code=12345');

			const result = parseLoginDeepLink(params);

			expect(result).toEqual({ email: 'user@example.com', code: null });
		});

		it('should ignore a non-digit code', () => {
			const params = new URLSearchParams('email=user@example.com&code=12345a');

			const result = parseLoginDeepLink(params);

			expect(result).toEqual({ email: 'user@example.com', code: null });
		});

		it('should ignore an otp param and only read code', () => {
			const params = new URLSearchParams('email=user@example.com&otp=123456');

			const result = parseLoginDeepLink(params);

			expect(result).toEqual({ email: 'user@example.com', code: null });
		});
	});

	describe('edge cases', () => {
		it('should return nulls when both params are missing', () => {
			const result = parseLoginDeepLink(new URLSearchParams());

			expect(result).toEqual({ email: null, code: null });
		});

		it('should accept email alone', () => {
			const result = parseLoginDeepLink(new URLSearchParams('email=user@example.com'));

			expect(result).toEqual({ email: 'user@example.com', code: null });
		});

		it('should accept code alone', () => {
			const result = parseLoginDeepLink(new URLSearchParams('code=123456'));

			expect(result).toEqual({ email: null, code: '123456' });
		});

		it('should trim surrounding whitespace', () => {
			const result = parseLoginDeepLink(
				new URLSearchParams({ email: '  user@example.com  ', code: ' 123456 ' })
			);

			expect(result).toEqual({ email: 'user@example.com', code: '123456' });
		});

		it('should ignore a code that contains spaces between digits', () => {
			const result = parseLoginDeepLink(
				new URLSearchParams({ email: 'user@example.com', code: '123 456' })
			);

			expect(result).toEqual({ email: 'user@example.com', code: null });
		});

		it('should ignore a code longer than 6 digits', () => {
			const result = parseLoginDeepLink(new URLSearchParams('email=user@example.com&code=1234567'));

			expect(result).toEqual({ email: 'user@example.com', code: null });
		});
	});
});

describe('loginDeepLinkKey', () => {
	describe('positive path', () => {
		it('should identify a link that has both params', () => {
			const params = new URLSearchParams('email=user%40example.com&code=123456');

			const key = loginDeepLinkKey(params);

			expect(key).toBe('user@example.com\n123456');
		});
	});

	describe('negative path', () => {
		it('should return null when neither param is present', () => {
			const key = loginDeepLinkKey(new URLSearchParams('next=/conversations'));

			expect(key).toBeNull();
		});
	});

	describe('edge cases', () => {
		it('should keep invalid values so the page can still clear them', () => {
			const key = loginDeepLinkKey(new URLSearchParams('code=12'));

			expect(key).toBe('\n12');
		});

		it('should differ when the code changes', () => {
			const first = loginDeepLinkKey(new URLSearchParams('email=user@example.com&code=123456'));
			const second = loginDeepLinkKey(new URLSearchParams('email=user@example.com&code=654321'));

			expect(first).not.toBe(second);
		});
	});
});
