# Pick the folder by state scope: `stores/` for singletons, `state/` for page-owned classes, `contexts/` for Svelte context

Place state modules in the folder that matches how they are shared:

- `stores/` — module-level singletons imported directly by any component (`src/lib/stores/theme.svelte.ts`, `src/lib/features/auth/stores/auth.svelte.ts`, `pages/create/stores/topic-picker.store.svelte.ts`).
- `state/` — classes exported (not instantiated at module level) and constructed by the page component that owns them, e.g. `pages/list/state/conversation-list-state.svelte.ts`.
- `contexts/` — Svelte `createContext` pairs plus a `create*Context()` helper called from the component subtree that provides them, e.g. `pages/session/contexts/sidepanel-context.svelte.ts`.

## Good

```ts
// pages/list/state/conversation-list-state.svelte.ts — class, instantiated per page
export class ConversationListFiltersState {
	filters: ConversationListFilters = $state(ConversationListFiltersState.DEFAULT_FILTERS);
	constructor(urlSearchParams: URLSearchParams) { /* ... */ }
}

// conversations-list.screen.svelte
const filtersState = new ConversationListFiltersState(page.url.searchParams);
```

```ts
// pages/session/contexts/sidepanel-context.svelte.ts — component-subtree state
export const [getSidepanelContext, setSidepanelContext] = createContext<SidepanelContext>();

export function createSidepanelContext() {
	const context: SidepanelContext = $state({ isOpened: false, /* ... */ });
	setSidepanelContext(context);
}
```

## Bad

```ts
// Don't put page-owned, constructor-driven state in stores/ as a module singleton —
// it would leak state across navigations and can't be seeded from the page URL
// pages/list/stores/conversation-list-filters.svelte.ts
export const filtersState = new ConversationListFiltersState(new URLSearchParams());

// Don't reach for a module singleton when the state belongs to one component subtree —
// use a context in contexts/ instead
export const sidepanelStore = new SidepanelStore();
```
