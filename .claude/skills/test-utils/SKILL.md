---
name: test-utils
description: Generate Vitest unit tests for TypeScript utility functions. Use when the user wants to write tests for a util file or function.
---

# Vitest Unit Test Generator for TypeScript Utils

Generate comprehensive unit tests for TypeScript utility functions using Vitest.

## Workflow

1. **Read the target file**
   - Read the utility file provided by the user
   - Identify all exported functions and their signatures
   - Understand types, dependencies, and edge cases

2. **Check for existing test file**
   - Look for an existing `.test.ts` or `.spec.ts` file alongside the util
   - If it exists, read it to avoid duplicating tests

3. **Generate tests**
   - When creating mock data objects, always look up the full type shape (via the source file, related type files, or node_modules) to ensure all required fields are included

4. **Write the test file**
   - Place it next to the source file with `.test.ts` suffix

5. **Run type checking and fix all errors**
   - After writing the test file, run `bun run check` and filter output to the test file
   - Fix all TypeScript errors before finishing — repeat until `bun run check` reports no errors for the test file

## Test Structure Rules

### AAA Pattern (Arrange, Act, Assert)

Every `it` block must follow the AAA structure with sections separated by blank lines. Do NOT add `// Arrange`, `// Act`, `// Assert` comments — the blank lines are sufficient:

```ts
it('should ...', () => {
  const input = ...;

  const result = fn(input);

  expect(result).toBe(...);
});
```

### Describe Block Structure

Each function gets its own top-level `describe`. Inside, always use three nested `describe` blocks:

```ts
describe('functionName', () => {
  describe('positive path', () => { ... });
  describe('negative path', () => { ... });
  describe('edge cases', () => { ... });
});
```

### Mocking Strategy

- Hoist mocks with `vi.mock(...)` at the top of the file (outside describe blocks)
- Set up mock implementations/return values in `beforeEach` blocks, not inside individual tests
- Use `vi.clearAllMocks()` in a top-level `beforeEach` to reset state between tests
- Only override mock behavior inside a test when that specific test needs a different value

```ts
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('../some-dep', () => ({ helperFn: vi.fn() }));

describe('myFunction', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		(helperFn as Mock).mockReturnValue('default');
	});

	describe('positive path', () => {
		it('should return expected value for valid input', () => {
			const input = 'valid';

			const result = myFunction(input);

			expect(result).toBe('expected');
		});
	});

	describe('negative path', () => {
		it('should throw when input is invalid', () => {
			const input = null;

			expect(() => myFunction(input)).toThrow('some error');
		});
	});

	describe('edge cases', () => {
		it('should handle empty string', () => {
			const input = '';

			const result = myFunction(input);

			expect(result).toBe('fallback');
		});
	});
});
```

## Coverage Goals

For every function, ensure tests cover:

**Positive path** — happy path with valid, typical inputs that return the expected result

**Negative path** — invalid inputs, error conditions, rejected promises, or functions that are expected to throw/return null/undefined

**Edge cases** — boundary values (empty string, 0, empty array, very large numbers), nullish values when the function accepts optional params, and realistic scenarios that could occur in production

## Import Style

- Import only what is used: `import { describe, it, expect, beforeEach, vi } from 'vitest'`
- Import `Mock` from `vitest` when casting mocks: `import { vi, type Mock } from 'vitest'`
- Use named imports from the source file, not default imports

## Important Rules

- NEVER add comments of any kind in the generated test code
- NEVER use `test(...)` — always use `it(...)`
- NEVER nest more than 3 levels deep
- ALWAYS use descriptive `it` labels starting with `"should ..."`
- Prefer `toEqual` for objects/arrays, `toBe` for primitives
- For async functions, use `async/await` in tests, not `.then()`
- Do not test implementation details — test observable behavior
