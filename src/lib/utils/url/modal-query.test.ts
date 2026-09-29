import { describe, expect, it } from 'vitest';
import { preserveModalQueryParam } from './modal-query';

describe('preserveModalQueryParam', () => {
	it('should preserve any modal value from the current search', () => {
		expect(preserveModalQueryParam('search=hund', '?search=old&modal=explain')).toBe(
			'search=hund&modal=explain'
		);
		expect(preserveModalQueryParam('search=hund', '?modal=capture')).toBe(
			'search=hund&modal=capture'
		);
	});
});
