# FDD feature boundaries

Dependencies flow one way: feature code (`src/lib/features/*`) may import shared `$lib` code, but shared `$lib` code must NEVER import from features. Cross-feature imports go only through a feature's public barrels via its alias (`$auth/...`, `$conversations/...`, `$appLayouts`); never deep-import `$lib/features/...` paths directly.

## Good

```typescript
// src/lib/features/conversations/pages/create/stores/create-conversation-payload.svelte.ts
import { authStore } from '$auth/stores'; // cross-feature via public barrel

// src/lib/features/conversations/api-client/conversation/api/http-post-create-conversation.ts
import { api } from '$lib/api-client/axios'; // feature → shared kernel is fine
```

## Bad

```typescript
// src/lib/components/utils/content-card.svelte — shared code importing a feature (inverted dependency)
import type { ConversationDTO } from '$conversations/types';

// deep import bypassing the barrel and the alias
import { authStore } from '$lib/features/auth/stores/auth.store.svelte';
```
