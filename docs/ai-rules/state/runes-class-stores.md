# Write shared state as class-based runes stores in `.svelte.ts` modules

Shared reactive state lives in `.svelte.ts` modules as a class using `$state` fields, with getters for derived values and methods for mutations. For app-wide singletons, export a single instance (e.g. `export const authStore = new AuthStore()`) — never the class. For per-page state that needs constructor arguments or testing, export the class itself (e.g. `ConversationListFiltersState`) and instantiate it in the page component. Re-export store instances through the folder's `index.ts`.

## Good

```ts
// src/lib/features/auth/stores/auth.svelte.ts
class AuthStore {
	user = $state<UserDTO | null>(null);

	get isAuthenticated(): boolean {
		return this.user !== null;
	}

	setUser(user: UserDTO | null) {
		this.user = user;
		// ...persistence
	}
}

export const authStore = new AuthStore();

// src/lib/features/auth/stores/index.ts
export { authStore } from './auth.svelte';
```

## Bad

```ts
// Don't use writable() stores from svelte/store for new state
import { writable, derived } from 'svelte/store';

export const user = writable<UserDTO | null>(null);
export const isAuthenticated = derived(user, ($user) => $user !== null);

// Don't export the class of an app-wide singleton and instantiate it in components
export class AuthStore { /* ... */ }
```
