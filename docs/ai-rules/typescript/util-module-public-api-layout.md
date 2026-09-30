# Split util public API into implementation + `.types.ts` pairs

When a feature `utils/` module exports multiple functions and their types, give each **public** function its own kebab-case file pair: `parse-additional-examples.ts` + `parse-additional-examples.types.ts`. The `.ts` file re-exports only types consumers need. Keep private consts, helpers, and internal interfaces unexported in the implementation file (or a private sibling). Do not export symbols “for completeness” if nothing outside the folder imports them.

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
