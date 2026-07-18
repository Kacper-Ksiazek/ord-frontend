# Shared vs feature placement

Generic design-system primitives stay in shared `$lib` (`$lib/components`, `$lib/utils`, …) even if only one feature uses them today — single-feature usage alone does not justify moving code into a feature. Move code into a feature only on hard domain coupling, i.e. when it imports feature types, constants, or stores. Currently `conversations` is the only product feature; `auth` and `app-layouts` are supporting features.

## Good

```typescript
// $lib/components/utils/content-card.svelte — generic primitive, stays shared
// even though only the conversations feature renders it today.

// src/lib/features/conversations/shared/utils/get-conversation-tone-label.ts
// — imports ConversationTone from $conversations/types → domain-coupled, lives in the feature.
import type { ConversationTone } from '$conversations/types';

export function getConversationToneLabel(tone: ConversationTone): string { /* ... */ }
```

## Bad

```typescript
// src/lib/utils/get-conversation-tone-label.ts — shared code coupled to a feature type
import type { ConversationTone } from '$conversations/types'; // inverted dependency

// src/lib/features/conversations/shared/components/scrollable-wrapper.svelte
// — a generic wrapper with no conversation domain knowledge; belongs in $lib/components.
```
