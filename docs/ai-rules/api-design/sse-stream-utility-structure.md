# Keep `createSSEStream` thin; extract helpers and test them

`$lib/api-client/utils/sse.ts` is shared by every SSE caller. The public entry (`createSSEStream`) should orchestrate only; line parsing, event flushing, and payload emission live in named module-level functions (same pattern as existing helpers like `emitPayload`, `flushEvent`, `pushStreamLine`). Any non-trivial branch in that pipeline gets colocated Vitest in `sse.test.ts` (or split test files next to extracted modules).

## Good

```ts
// sse.ts — createSSEStream wires helpers; helpers are exported only if another module needs them
function flushEvent(state: ParseState): StreamEvent | null {
	/* … */
}

export function createSSEStream<T>(url: string, options: SSEOptions): Observable<T> {
	return new Observable((subscriber) => {
		// calls pushStreamLine, flushEvent, emitPayload — no 150-line inline closure
	});
}
```

```ts
// sse.test.ts — regression tests for parsing edge cases
describe('flushEvent', () => {
	it('should …', () => {
		/* … */
	});
});
```

## Bad

```ts
export function createSSEStream<T>(…) {
	return new Observable((subscriber) => {
		// 150 lines of nested functions and parsing logic with no extracted helpers or tests
	});
}
```
