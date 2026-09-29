import { describe, expect, it } from 'vitest';
import {
	isExplainModalOpenFromLocationSearch,
	isExplainModalQuery,
	searchWithExplainModal
} from './explain-modal-url';

describe('searchWithExplainModal', () => {
	describe('positive path', () => {
		it('should add modal=explain and keep the other params', () => {
			expect(searchWithExplainModal('?view=analytics&wordId=abc', true)).toBe(
				'?view=analytics&wordId=abc&modal=explain'
			);
		});

		it('should remove only modal=explain', () => {
			expect(searchWithExplainModal('?view=analytics&modal=explain', false)).toBe('?view=analytics');
		});
	});

	describe('negative path', () => {
		it('should leave a different modal value in place when closing explain', () => {
			expect(searchWithExplainModal('?modal=capture', false)).toBe('?modal=capture');
		});
	});
});

describe('isExplainModalQuery', () => {
	it('should match modal=explain', () => {
		expect(isExplainModalQuery(new URLSearchParams('modal=explain'))).toBe(true);
		expect(isExplainModalQuery(new URLSearchParams('modal=capture'))).toBe(false);
	});
});

describe('isExplainModalOpenFromLocationSearch', () => {
	it('should read modal=explain from a location search string', () => {
		expect(isExplainModalOpenFromLocationSearch('?modal=explain')).toBe(true);
		expect(isExplainModalOpenFromLocationSearch('?modal=capture')).toBe(false);
	});
});
