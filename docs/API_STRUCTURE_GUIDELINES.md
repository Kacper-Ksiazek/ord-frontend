# API Structure Guidelines

## Feature Slice Architecture

This project uses **Feature-Driven Development (FDD)** where each feature is self-contained. Feature API clients live next to their feature module; shared HTTP infrastructure stays in `$lib/api-client`.

```
src/lib/
├── api-client/                          # Shared kernel
│   ├── axios.ts                         # Axios instance (credentials, interceptors)
│   ├── api/                             # Cross-feature REST callers (no owning feature)
│   │   └── http-post-request-tts-audio.ts
│   └── utils/
│       ├── sse.ts                       # SSE via fetch + RxJS Observable
│       └── sse.types.ts
└── features/
    ├── auth/api-client/                 # → import via `$auth/api-client`
    │   ├── api/                         # REST callers (http-* files)
    │   ├── mutations/                   # TanStack Query mutations
    │   ├── queries/                     # TanStack Query queries
    │   └── keys.ts
    └── conversations/api-client/        # → import via `$conversations/api-client`
        ├── conversation/                # Conversation CRUD, list, overview
        │   ├── api/
        │   ├── sse/
        │   ├── mutations/
        │   ├── queries/
        │   └── keys.ts
        ├── ongoing-conversation/        # Live session: messages, analysis, tips
        │   ├── api/
        │   ├── sse/
        │   ├── mutations/
        │   └── keys.ts
        ├── queries/                     # Re-exports conversation queries
        └── index.ts
```

### Placement rules

| Call type | Location |
|-----------|----------|
| Feature-owned REST | `features/{feature}/api-client/{subdomain?}/api/http-*.ts` |
| Feature-owned SSE | `features/{feature}/api-client/{subdomain?}/sse/http-*.ts` |
| Cross-feature REST | `$lib/api-client/api/http-*.ts` |
| TanStack mutations | `features/{feature}/api-client/{subdomain?}/mutations/use-*-mutation.ts` |
| TanStack queries | `features/{feature}/api-client/{subdomain?}/queries/use-*-query.ts` |

The `conversations` feature splits API clients into **`conversation`** (list, create, overview) and **`ongoing-conversation`** (live session flows). Both subdomains follow the same `api/`, `sse/`, `mutations/`, `queries/` layout.

## HTTP Prefix Naming

Every function that calls the backend (REST or SSE) uses an **`http` prefix** plus the **HTTP method** in both the **file name** and the **exported function name**. This makes network I/O and the verb used easy to spot in imports, stack traces, and code search.

| Layer | File pattern | Export pattern | Example |
|-------|--------------|----------------|---------|
| REST (GET) | `http-get-{resource-kebab}.ts` | `httpGet{ResourcePascal}` | `http-get-current-user.ts` → `httpGetCurrentUser` |
| REST (POST) | `http-post-{action-kebab}.ts` | `httpPost{ActionPascal}` | `http-post-verify-otp.ts` → `httpPostVerifyOtp` |
| REST (DELETE) | `http-delete-{action-kebab}.ts` | `httpDelete{ActionPascal}` | `http-delete-logout.ts` → `httpDeleteLogout` |
| REST (PATCH) | `http-patch-{action-kebab}.ts` | `httpPatch{ActionPascal}` | `http-patch-user-profile.ts` → `httpPatchUserProfile` |
| SSE (POST) | `http-post-{stream-kebab}.ts` | `httpPost{StreamPascal}` | `http-post-request-ai-message.ts` → `httpPostRequestAIMessage` |

**Rules:**

- File name: `http-{method}-{action-kebab}.ts` where `{method}` is the lowercase HTTP verb (`get`, `post`, `patch`, `delete`, …).
- Export name: `http{Method}{ActionPascal}` where `{Method}` is PascalCase verb (`Get`, `Post`, `Patch`, `Delete`, …).
- SSE streams use the same method prefix as the underlying request (currently all `http-post-*`).
- Acronyms in export names use uppercase (`AI`, `OTP`, `SSE`): `httpPostGenerateAIInterlocutor`, `httpPostRequestAIMessage`.
- Mutations and queries keep their existing `create*Mutation` / `create*Query` / `use-*` naming — only the low-level HTTP callers get the prefix.
- Shared infrastructure (`axios.ts`, `sse.ts`) is not prefixed; it does not call a specific endpoint.

## REST API Calls

**Location:** `src/lib/features/{feature}/api-client/{subdomain?}/api/http-{method}-{action}.ts`

**Pattern:**

```typescript
import type { OtpRequestBody } from '$auth/types';
import { api } from '$lib/api-client/axios';

export async function httpPostRequestOtp(body: OtpRequestBody): Promise<void> {
	await api.post('/api/v1/auth/otp-request', body);
}
```

**Rules:**

- Use `api` from `$lib/api-client/axios`
- Return `response.data` explicitly (or `void` for empty responses)
- Import types from the owning feature barrel (e.g. `$auth/types`, `$conversations/types`)
- Endpoint path: `/api/v1/{resource}/{action}`

## SSE (Server-Sent Events) Calls

**Location:** `src/lib/features/{feature}/api-client/{subdomain?}/sse/http-post-{stream}.ts`

**Pattern:**

```typescript
import type { Observable } from 'rxjs';
import type { CreateOngoingConversationMessageRequest } from '$conversations/types';
import { createSSEStream } from '$lib/api-client/utils/sse';

export function httpPostRequestAIMessage(
	body: CreateOngoingConversationMessageRequest
): Observable<string> {
	return createSSEStream<string>('/api/v1/conversations/ongoing/ai/request-message', {
		method: 'POST',
		body
	});
}
```

**Rules:**

- Use `createSSEStream` from `$lib/api-client/utils/sse`
- Return `Observable<T>` (RxJS)
- Use POST method with body for SSE streams
- Generic type `T` defaults to appropriate stream item type
- Same `http` prefix convention as REST callers

## Mutations

**Location:** `src/lib/features/{feature}/api-client/{subdomain?}/mutations/use-{action}-mutation.ts`

**Pattern:**

```typescript
import { createMutation } from '@tanstack/svelte-query';
import type { CreateConversationRequest } from '$conversations/types';
import { httpPostCreateConversation } from '../api/http-post-create-conversation';

export function createCreateConversationMutation() {
	return createMutation(() => ({
		mutationFn: (body: CreateConversationRequest) => httpPostCreateConversation(body)
	}));
}
```

**Rules:**

- Export function named `create{Action}Mutation()`
- Use `createMutation` from `@tanstack/svelte-query`
- Call the `http*` API function in `mutationFn`
- Add `onSuccess`/`onError` handlers if side effects needed

## Queries

**Location:** `src/lib/features/{feature}/api-client/{subdomain?}/queries/use-{resource}-query.ts`

**Pattern:**

```typescript
import { createQuery } from '@tanstack/svelte-query';
import type { UserDTO } from '$auth/types';
import { httpGetCurrentUser } from '../api/http-get-current-user';
import { authKeys } from '../keys';

export function createCurrentUserQuery() {
	return createQuery<UserDTO>(() => ({
		queryKey: authKeys.currentUser(),
		queryFn: httpGetCurrentUser,
		staleTime: 1000 * 60 * 5,
		retry: false
	}));
}
```

**Rules:**

- Export function named `create{Resource}Query()`
- Use `createQuery` from `@tanstack/svelte-query`
- Call the `http*` API function in `queryFn`
- Define query keys in a co-located `keys.ts` factory

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

## Feature root barrels

Each feature may expose a root `index.ts` re-exporting its public sub-barrels (e.g. `$auth` → `api-client`, `components`, `guards`, …). Prefer **sub-barrel** imports (`$auth/stores`, `$conversations/pages/create`) for clarity; the root barrel is for discoverability, not a replacement for sub-paths.

`$lib/components` remains the shared design-system layer. Single-feature usage today does **not** by itself mean code belongs inside a feature — only hard domain coupling (e.g. importing feature types from shared code) requires a move.

## Page-internal layout

| Folder | When to use | Examples |
|--------|-------------|----------|
| `stores/` | Module-level reactive state shared across page subcomponents | `topic-picker.store.svelte.ts`, `create-conversation-payload.svelte.ts` |
| `state/` | Page-specific state classes (filters, list UI) | `conversation-list-state.svelte.ts` |
| `contexts/` + `services/` | Complex flows with Svelte context and composables | session `messages-context`, `use-message-flow` |
| `services/` (without context) | One-off orchestration calling `http*` / SSE outside components | `suggest-conversation-topics.ts` |

**Store file naming:** prefer `*.store.svelte.ts` for dedicated store modules; `*-state.svelte.ts` for state classes under `state/`; session composables as `use-*.svelte.ts` under `services/`.

## Barrel Exports

- Feature `api-client/index.ts` exports **mutations and queries** — not raw `http*` callers.
- Import `http*` functions directly from their file path when needed outside mutations/queries (e.g. SSE in services, guards calling REST).
- Auth REST callers are re-exported from `$auth/api-client/api/index.ts` for guard and loader use.

## Svelte composables (`use*`)

Session and other UI lifecycle helpers that read Svelte context, register `onMount` / `onDestroy`, or own reactive local state live as **`use-*.svelte.ts`** modules and export a **`use*`** function (e.g. `useMessageFlow`, `useInitializeConversation`).

| Layer | File pattern | Export pattern | Example |
|-------|--------------|----------------|---------|
| TanStack Query wrappers | `use-*-query.ts` / `use-*-mutation.ts` | `create*Query` / `create*Mutation` | `use-conversations-query.ts` → `createConversationsQuery` |
| UI / session composables | `use-*.svelte.ts` | `use*` | `use-message-flow.svelte.ts` → `useMessageFlow` |

**Rules:**

- Prefer the `use*` prefix for composables that must run in a component lifecycle (context, mount/destroy, subscriptions).
- Keep TanStack wrappers as `create*` even when the file name starts with `use-` — that matches `@tanstack/svelte-query` factory style already used in the api-client.
- Pure helpers (no context/lifecycle) stay plain functions in `*-helpers.ts` / `utils/` without a `use*` prefix.
