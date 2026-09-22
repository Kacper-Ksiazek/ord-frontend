# Unit tests: Vitest, colocated `.test.ts`

Write unit tests with Vitest in a `.test.ts` file placed next to the source file. Focus on pure utils and state logic (classes/functions in `.ts` / `.svelte.ts` modules), not component rendering. Use `describe` per function/class, `it` labels starting with `"should ..."` where descriptive, and AAA structure separated by blank lines (no `// Arrange` comments).

For **utils** with branching behavior, prefer the three nested `describe` blocks from
`.claude/skills/test-utils/SKILL.md`: `positive path`, `negative path`, `edge cases`. For stores
and other modules, the same clarity helps but you may use a flatter structure when the behavior is
small — still colocate `*.test.ts` and avoid tests that only assert the obvious (see
`general/proportionality-for-small-team.md`).

Vitest runs **two projects** (`vite.config.ts`):

| Glob                                                          | Project  | Runtime                       |
| ------------------------------------------------------------- | -------- | ----------------------------- |
| `src/**/*.svelte.{test,spec}.{js,ts}`                         | `client` | Browser + Playwright Chromium |
| `src/**/*.{test,spec}.{js,ts}` (excluding `*.svelte.test.ts`) | `server` | Node                          |

**Name tests for the project they belong in.** A wrong suffix sends store/guard tests to the browser project; CI `unit-tests` does not install Playwright, so the job fails even when assertions pass.

After adding or renaming test files, run `bun run test:server` (node tests, matches most unit work) or `bun run test` (both projects, needs `bun run test:e2e:install` locally). ESLint rule `ord/vitest-test-file-naming` (via `bun run lint` and lint-staged) rejects misnamed `*.svelte.test.ts` files in stores, guards, utils, or next to `.ts` / `.svelte.ts` modules.

## Good

```ts
// src/lib/utils/format-time.test.ts — next to format-time.ts (server project)
import { describe, it, expect } from 'vitest';
import { formatTime } from './format-time';

describe('formatTime', () => {
	describe('positive path', () => {
		it('should format seconds as m:ss', () => {
			expect(formatTime(65)).toBe('1:05');
		});
	});
});
```

```ts
// src/lib/features/auth/stores/auth.test.ts — next to auth.svelte.ts (server project)
// Stores, guards, and utils always use *.test.ts, never *.svelte.test.ts
```

```ts
// src/lib/components/button/button.svelte.test.ts — next to button.svelte (client project)
// Component rendering only; requires Playwright Chromium locally for bun run test
```

## Bad

```ts
// src/lib/features/auth/stores/auth.svelte.test.ts next to auth.svelte.ts
// Matches the browser glob → CI tries to launch Playwright without chromium installed
```

```ts
// tests/unit/formatTime.spec.ts — separate test directory, `test()` instead of `it()`,
// narration comments, no describe structure
import { test, expect } from 'vitest';
import { formatTime } from '../../src/lib/utils/format-time';

test('formatTime works', () => {
	const result = formatTime(65);
	expect(result).toBe('1:05');
});
```
