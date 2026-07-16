# Derive request/response types from `@kacper-ksiazek/ord-api-types`

API payload types are aliased from the generated OpenAPI package — via `components['schemas'][...]` or `paths[...]` lookups — in the feature's `types/api/requests.ts` / `types/api/responses.ts`, then re-exported through the feature types barrel. `http*` functions, mutations, and queries import from the barrel (`$auth/types`, `$conversations/types`), never from the package directly and never from hand-written duplicates.

## Good

```ts
// src/lib/features/conversations/types/api/requests.ts
import type { components } from '@kacper-ksiazek/ord-api-types';

export type CreateConversationRequest = components['schemas']['CreateConversationRequest'];

// consumer
import type { CreateConversationRequest } from '$conversations/types';
```

## Bad

```ts
// Hand-written duplicate of a backend schema, defined inline next to the caller
interface CreateConversationRequest {
	topic: string;
	language: string; // drifts from the backend contract silently
}
```
