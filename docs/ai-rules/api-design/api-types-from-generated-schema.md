# Types from `@kacper-ksiazek/ord-api-types`

Backend contract types (DTOs, request/response bodies, enum unions) come from the generated
OpenAPI package — via `components['schemas'][...]` or `paths[...]` lookups. Re-export them through
the feature `types/` barrel (`domain/`, `types/api/requests.ts`, `types/api/responses.ts` as needed).
`http*` functions, queries, and mutations import from `$auth/types`, `$conversations/types`, etc. —
not from `@kacper-ksiazek/ord-api-types` directly in scattered files, and not as hand-written duplicates.

## Good

```ts
// src/lib/features/conversations/types/domain/conversation.ts
import type { components } from '@kacper-ksiazek/ord-api-types';

export type ConversationDTO = components['schemas']['ConversationDTO'];
export type RecencyBucket = components['schemas']['RecencyBucket'];

// src/lib/features/conversations/types/api/requests.ts
export type CreateConversationRequest = components['schemas']['CreateConversationRequest'];

// consumer
import type { CreateConversationRequest, ConversationDTO } from '$conversations/types';
```

## Bad

```ts
// Hand-written duplicate of a backend schema
export interface ConversationDTO {
	id: string;
	type: 'SMALL_TALK' | 'EXAM_PRACTICE';
	title: string;
}

// Inline duplicate next to the caller instead of the feature types barrel
interface CreateConversationRequest {
	topic: string;
	language: string;
}
```
