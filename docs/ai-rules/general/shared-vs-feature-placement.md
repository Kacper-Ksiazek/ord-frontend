# Shared vs feature placement

Generic design-system primitives stay in shared `$lib` (`$lib/components`, `$lib/utils`, …) even if only one feature uses them today — single-feature usage alone does not justify moving code into a feature. The same default applies to **domain-agnostic mechanics with high regression cost** (SSE subscription lifecycle, generic URL query preservation, shared parsing): place them in `$lib/services/` or `$lib/utils/` even when only one feature uses them now. Feature `use-*-flow` composables orchestrate product APIs and compose those primitives; **feature identity** (named query params, modal values, feature-specific DTOs) stays in the feature — never in `$lib`.

Move code into a feature only on hard domain coupling, i.e. when it imports feature types, constants, or stores. Currently `conversations` and `words` are the product features; `auth` and `app-layouts` are supporting features.

## Good

```typescript
// $lib/services/use-text-stream-subscription.svelte.ts — RxJS teardown reusable across SSE UIs
// $lib/utils/url/preserve-query-param.ts — generic param preservation for any screen

// $aiExplainer/shared/utils/explain-modal-url.ts — modal=explain identity lives in the feature
export const EXPLAIN_MODAL_QUERY_VALUE = 'explain';

// $lib/components/utils/content-card.svelte — generic primitive, stays shared
// even though only the conversations feature renders it today.

// src/lib/features/conversations/shared/utils/get-conversation-tone-label.ts
// — imports ConversationTone from $conversations/types → domain-coupled, lives in the feature.
import type { ConversationTone } from '$conversations/types';

export function getConversationToneLabel(tone: ConversationTone): string {
	/* ... */
}
```

## Bad

```typescript
// src/lib/utils/get-conversation-tone-label.ts — shared code coupled to a feature type
import type { ConversationTone } from '$conversations/types'; // inverted dependency

// src/lib/features/conversations/shared/components/scrollable-wrapper.svelte
// — a generic wrapper with no conversation domain knowledge; belongs in $lib/components.

// src/lib/utils/url/modal-query.ts — explain-specific constants/helpers (feature identity in $lib)
export const EXPLAIN_MODAL_QUERY_VALUE = 'explain';
```
