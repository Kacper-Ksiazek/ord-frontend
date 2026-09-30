import { describe, expect, it } from 'vitest';
import { preserveQueryParam } from './preserve-query-param';

describe('preserveQueryParam', () => {
	it('should append the current param onto a rebuilt query', () => {
		expect(preserveQueryParam('modal', 'search=hund', '?search=old&modal=explain')).toBe(
			'search=hund&modal=explain'
		);
	});

	it('should keep an empty query as only the preserved param', () => {
		expect(preserveQueryParam('modal', '', '?modal=explain')).toBe('modal=explain');
	});

	it('should leave the query unchanged when the param is absent', () => {
		expect(preserveQueryParam('modal', 'view=list', '?view=list')).toBe('view=list');
	});
});
