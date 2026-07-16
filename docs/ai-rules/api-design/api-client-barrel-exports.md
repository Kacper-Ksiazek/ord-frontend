# Feature `api-client` barrels export mutations and queries, not raw `http*` callers

A feature's `api-client/index.ts` re-exports only the TanStack Query wrappers. Raw `http*` functions are imported directly from their file path when needed outside mutations/queries (SSE callers in services, REST in guards/loaders). Exception: auth REST callers are re-exported from `$auth/api-client/api/index.ts` for guard and loader use.

## Good

```ts
// src/lib/features/conversations/api-client/index.ts
export * from './queries';
export * from './conversation/mutations';
export * from './ongoing-conversation/mutations';

// service importing an SSE caller by direct path
import { httpPostSuggestConversationTopics } from '$conversations/api-client/conversation/sse/http-post-suggest-conversation-topics';
```

## Bad

```ts
// api-client/index.ts leaking every low-level caller into the public surface
export * from './conversation/api';
export * from './conversation/sse';
export * from './ongoing-conversation/api';
```
