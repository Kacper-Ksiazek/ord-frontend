# API Structure Guidelines

## Feature Slice Architecture

This project uses **Feature-Driven Development (FDD)** where each feature is self-contained:

```
src/lib/api-client/
├── {feature}/              # e.g., auth, conversation
│   ├── api/               # REST API calls
│   ├── sse/               # SSE (Server-Sent Events) streams
│   ├── mutations/         # TanStack Query mutations
│   ├── queries/           # TanStack Query queries
│   └── keys.ts            # Query keys (if needed)
```

## REST API Calls

**Location:** `{feature}/api/{endpoint-name}.ts`

**Pattern:**

```typescript
import type { RequestType } from '$lib/types/{feature}/api/requests';
import type { ResponseType } from '$lib/types/{feature}/api/responses';
import { api } from '../../axios';

export async function functionName(body: RequestType): Promise<ResponseType> {
	const response = await api.post<ResponseType>('/api/v1/{endpoint}', body);
	return response.data;
}
```

**Rules:**

- Use `api` from `../../axios` (or `../../../axios` if nested)
- Return `response.data` explicitly
- Import types from `$lib/types/{feature}/api/`
- Endpoint path: `/api/v1/{resource}/{action}`

## SSE (Server-Sent Events) Calls

**Location:** `{feature}/sse/{stream-name}.ts`

**Pattern:**

```typescript
import type { Observable } from 'rxjs';
import type { RequestType } from '$lib/types/{feature}/api/requests';
import { createSSEStream } from '../../utils/sse';

export function streamName<T = StreamItemType>(payload: RequestType): Observable<T> {
	return createSSEStream<T>('/api/v1/{endpoint}', {
		method: 'POST',
		body: payload
	});
}
```

**Rules:**

- Use `createSSEStream` from `../../utils/sse`
- Return `Observable<T>` (RxJS)
- Use POST method with body for SSE streams
- Generic type `T` defaults to appropriate stream item type

## Mutations

**Location:** `{feature}/mutations/use-{action}-mutation.ts`

**Pattern:**

```typescript
import { createMutation } from '@tanstack/svelte-query';
import type { RequestType } from '$lib/types/{feature}/api/requests';
import { apiFunction } from '../api/{endpoint}';

export function create{Action}Mutation() {
  return createMutation(() => ({
    mutationFn: (body: RequestType) => apiFunction(body)
  }));
}
```

**Rules:**

- Export function named `create{Action}Mutation()`
- Use `createMutation` from `@tanstack/svelte-query`
- Call API function in `mutationFn`
- Add `onSuccess`/`onError` handlers if side effects needed

## Type Organization

Types live in `src/lib/types/{feature}/api/`:

- `requests.ts` - Request payloads
- `responses.ts` - Response types
- `errors.ts` - Error types

Import from `$lib/types/{feature}/api/requests` (or `/responses`, `/errors`).
