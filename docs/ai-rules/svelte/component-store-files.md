# Component-local reactive state in `<name>.store.svelte.ts`

When a component needs reactive state shared across its sub-components, put it in a colocated `<component-name>.store.svelte.ts` file (the `.svelte.ts` extension enables runes and `svelte/reactivity` classes). Examples: `sidebar/sidebar.store.svelte.ts`, `stores/topic-picker.store.svelte.ts`.

## Good

```svelte
<!-- sidebar/sidebar.store.svelte.ts -->
import { SvelteMap } from 'svelte/reactivity';

export const expandedSections = new SvelteMap<string, boolean>();

<!-- sidebar/components/sidebar-section.svelte -->
<script lang="ts">
	import { expandedSections } from '../sidebar.store.svelte';
</script>
```

## Bad

```svelte
<!-- shared state defined in a plain .ts file (not reactive),
     or prop-drilled through every sub-component instead -->
<script lang="ts">
	import { expandedSections } from './sidebar-state'; // plain Map in sidebar-state.ts
</script>
```
