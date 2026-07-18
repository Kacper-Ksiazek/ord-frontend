# Component folder layout with barrel export

Each non-trivial component lives in its own kebab-case folder containing `<name>.svelte`, an `index.ts` barrel export, and optional colocated `<name>.types.ts`, `<name>.constants.ts`, `<name>.store.svelte.ts`, and `<name>.stories.svelte`. Only trivial, self-contained components (< ~100 lines, no sub-components) may be a bare single `.svelte` file.

## Good

```svelte
<!-- src/lib/components/buttons/button/
     ├── button.svelte
     ├── button.types.ts
     ├── button.stories.svelte
     └── index.ts -->

<!-- index.ts -->
export { default as Button } from './button.svelte';

<!-- consumer -->
<script lang="ts">
	import { Button } from '$lib/components/buttons/button';
</script>
```

```text
<!-- Folder without index.ts — consumers import the .svelte path directly -->
<!-- src/lib/components/playback-progress-bar/playback-progress-bar.svelte -->
```

## Bad

```svelte
<!-- PascalCase filename, no folder, no barrel export -->
<!-- src/lib/components/Button.svelte -->
<script lang="ts">
	import Button from '$lib/components/Button.svelte';
</script>
```
