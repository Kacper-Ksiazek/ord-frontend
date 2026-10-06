# Split util public API into implementation + `.types.ts` pairs

When a feature `utils/` module exports multiple functions and their types, give each **public** function its own kebab-case file pair: `parse-additional-examples.ts` + `parse-additional-examples.types.ts`, plus a colocated `parse-additional-examples.test.ts`. Exported types live only in the `.types.ts` file. The implementation file re-exports the types consumers need and holds the function body.

A private helper used once stays inline in that function. A helper used more than once may be a private function in the same file. Do not export symbols “for completeness” if nothing outside the folder imports them. Split a util file before it passes roughly **200 lines**. Trivial one-liners may be duplicated instead of extracted.

## Good

```text
shared/utils/
├── parse-additional-examples.ts
├── parse-additional-examples.types.ts
├── parse-similar-expressions.ts
└── parse-similar-expressions.types.ts
```

```ts
// parse-additional-examples.ts
export type { AdditionalExample } from './parse-additional-examples.types';
export function parseAdditionalExamples(raw: string): AdditionalExample[] {
	/* … */
}
```

## Bad

```ts
// parse-explainer-follow-up.ts — one file exporting types, helpers, and three public parsers
export interface SimilarExpression {
	/* … */
}
export const INTERNAL_REGEX = /…/;
export function parseSimilarExpressions(…) {
	/* … */
}
export function parseAdditionalExamples(…) {
	/* … */
}
```
