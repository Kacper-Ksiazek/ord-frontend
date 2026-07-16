# TanStack Query wrappers: `use-*` files exporting `create*Query` / `create*Mutation`

Queries live in `queries/use-{resource}-query.ts` and mutations in `mutations/use-{action}-mutation.ts`, but the export follows the `@tanstack/svelte-query` factory style: `create{Resource}Query()` / `create{Action}Mutation()`. They wrap exactly one `http*` function and take query keys from the co-located `keys.ts` factory (`{feature}Keys` with an `all` base and derived key functions).

## Good

```ts
// src/lib/features/auth/api-client/keys.ts
export const authKeys = {
	all: ['auth'] as const,
	currentUser: () => [...authKeys.all, 'current-user'] as const
};

// src/lib/features/auth/api-client/queries/use-current-user-query.ts
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

## Bad

```ts
// Inline string keys, axios call inside queryFn, hook-style export name
import { createQuery } from '@tanstack/svelte-query';
import { api } from '$lib/api-client/axios';

export function useCurrentUser() {
	return createQuery(() => ({
		queryKey: ['currentUser'],
		queryFn: async () => (await api.get('/api/v1/users/me')).data
	}));
}
```
