# Separate type imports

In a Svelte or TypeScript file, all `import type` lines come first, then value imports. A local `type` alias sits with the other types, not between import groups.

## Good

```ts
import type { ConversationSummaryDTO, ConversationType } from '$conversations/types';
import type { Snippet } from 'svelte';

import AiInterlocutorAvatar from '$conversations/shared/components/ai-interlocutor-avatar.svelte';
import { Badge } from '$lib/components/utils/badge';

type ConversationRow = { topic?: string | null; type?: ConversationType | null };
```

## Bad

```ts
import type { ConversationType } from '$conversations/types';

type ConversationRow = { type?: ConversationType | null };

import { Badge } from '$lib/components/utils/badge';
```
