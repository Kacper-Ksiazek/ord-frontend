# Backend types come from `@kacper-ksiazek/ord-api-types`

All backend contract types (DTOs, request/response bodies, enum unions) should be derived from the generated `@kacper-ksiazek/ord-api-types` package via `components['schemas'][...]` or `paths[...]` lookups, re-exported through feature `types/` modules. Do not hand-write a backend shape when the type already exists in the contract package.

## Good

```ts
// src/lib/features/conversations/types/domain/conversation.ts
import type { components } from '@kacper-ksiazek/ord-api-types';

export type ConversationType = components['schemas']['ConversationDTO']['type'];
export type ConversationDTO = components['schemas']['ConversationDTO'];
export type RecencyBucket = components['schemas']['RecencyBucket'];
```

## Bad

```ts
// Hand-written duplicate of a backend DTO that already exists in ord-api-types
export interface ConversationDTO {
	id: string;
	type: 'SMALL_TALK' | 'EXAM_PRACTICE';
	title: string;
}
```
