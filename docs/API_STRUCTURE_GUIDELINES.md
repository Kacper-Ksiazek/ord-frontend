# API Structure Guidelines

## Feature Slice Architecture

This project uses **Feature-Driven Development (FDD)** where each feature is self-contained. Feature API clients live next to their feature module; shared HTTP infrastructure stays in `$lib/api-client`.

```
src/lib/
├── api-client/                 # Shared kernel: axios instance, SSE helpers
│   ├── axios.ts
│   └── utils/sse.ts
└── features/
    ├── auth/api-client/        # → import via `$auth/api-client`
    └── conversations/api-client/  # → import via `$conversations/api-client`
```

## REST API Calls

**Location:** `src/lib/features/{feature}/api-client/api/{endpoint-name}.ts`

**Pattern:**

```typescript
import type { RequestType } from '$auth/types';
import type { ResponseType } from '$auth/types';
import { api } from '$lib/api-client/axios';

export async function requestOtp(body: RequestType): Promise<ResponseType> {
	const response = await api.post<ResponseType>('/api/v1/auth/otp-request', body);
	return response.data;
}
```

**Rules:**

- Use `api` from `$lib/api-client/axios`
- Return `response.data` explicitly
- Import types from the owning feature barrel (e.g. `$auth/types`, `$conversations/types`)
- Endpoint path: `/api/v1/{resource}/{action}`

## SSE (Server-Sent Events) Calls

**Location:** `src/lib/features/{feature}/api-client/sse/{stream-name}.ts`

**Pattern:**

```typescript
import type { Observable } from 'rxjs';
import type { RequestType } from '$conversations/types';
import { createSSEStream } from '$lib/api-client/utils/sse';

export function requestAiMessage<T = StreamItemType>(payload: RequestType): Observable<T> {
	return createSSEStream<T>('/api/v1/ongoing-conversations/messages', {
		method: 'POST',
		body: payload
	});
}
```

**Rules:**

- Use `createSSEStream` from `$lib/api-client/utils/sse`
- Return `Observable<T>` (RxJS)
- Use POST method with body for SSE streams
- Generic type `T` defaults to appropriate stream item type

## Mutations

**Location:** `src/lib/features/{feature}/api-client/mutations/use-{action}-mutation.ts`

**Pattern:**

```typescript
import { createMutation } from '@tanstack/svelte-query';
import type { RequestType } from '$conversations/types';
import { createConversation } from '../api/create-conversation';

export function createCreateConversationMutation() {
	return createMutation(() => ({
		mutationFn: (body: RequestType) => createConversation(body)
	}));
}
```

**Rules:**

- Export function named `create{Action}Mutation()`
- Use `createMutation` from `@tanstack/svelte-query`
- Call API function in `mutationFn`
- Add `onSuccess`/`onError` handlers if side effects needed

## Type Organization

Types live in `src/lib/features/{feature}/types/`:

- `api/requests.ts` - Request payloads
- `api/responses.ts` - Response types
- `api/errors.ts` - Error types
- `domain/entities.ts` - Domain DTOs and normalized runtime shapes

Import from the feature alias (e.g. `$auth/types`, `$conversations/types`).

Cross-cutting types that are not owned by a single feature may live in `src/lib/types/core/`.

## Import Aliases

Configured in `svelte.config.js`:

| Alias | Path |
|-------|------|
| `$auth` | `src/lib/features/auth` |
| `$conversations` | `src/lib/features/conversations` |
| `$appLayouts` | `src/lib/features/app-layouts` |

Prefer feature aliases over deep `$lib/features/...` paths. Routes should be thin wrappers that import pages from feature barrels.
