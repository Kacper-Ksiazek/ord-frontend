# Unit tests: Vitest, colocated `.test.ts`

Write unit tests with Vitest in a `.test.ts` file placed next to the source file. Focus on pure utils and state logic (classes/functions in `.ts` / `.svelte.ts` modules), not component rendering. Use `describe` per function/class, `it` labels starting with `"should ..."` where descriptive, AAA structure separated by blank lines (no `// Arrange` comments), and for utils the three nested `describe` blocks: `positive path`, `negative path`, `edge cases` (see `.claude/skills/test-utils/SKILL.md`). Run with `bun run test` (or `bun run test:unit` for watch mode); vitest's `requireAssertions` is enabled, so every test must assert.

## Good

```ts
// src/lib/utils/format-time.test.ts — next to src/lib/utils/format-time.ts
import { describe, it, expect } from 'vitest';
import { formatTime } from './format-time';

describe('formatTime', () => {
	describe('positive path', () => {
		it('should format seconds as m:ss', () => {
			expect(formatTime(65)).toBe('1:05');
		});
	});

	describe('negative path', () => {
		it('should clamp negative values to zero', () => {
			expect(formatTime(-10)).toBe('0:00');
		});
	});

	describe('edge cases', () => {
		it('should floor fractional seconds', () => {
			expect(formatTime(59.9)).toBe('0:59');
		});
	});
});
```

## Bad

```ts
// tests/unit/formatTime.spec.ts — separate test directory, `test()` instead of `it()`,
// narration comments, no describe structure
import { test, expect } from 'vitest';
import { formatTime } from '../../src/lib/utils/format-time';

test('formatTime works', () => {
	// call the function
	const result = formatTime(65);
	// check the result
	expect(result).toBe('1:05');
});
```
