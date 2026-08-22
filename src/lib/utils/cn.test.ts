import { describe, expect, it } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
	it('joins truthy class names', () => {
		const hidden = false;

		expect(cn('flex', hidden && 'hidden', 'gap-2')).toBe('flex gap-2');
	});

	it('lets later Tailwind utilities win', () => {
		expect(cn('p-2', 'p-4')).toBe('p-4');
	});
});
