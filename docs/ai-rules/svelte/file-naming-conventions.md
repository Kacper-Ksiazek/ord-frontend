# Kebab-case file names with role suffixes

All component-related files are kebab-case and named after the component with a role suffix: `<name>.svelte`, `<name>.types.ts`, `<name>.constants.ts`, `<name>.store.svelte.ts`, `<name>.stories.svelte`, plus `index.ts` for the barrel. Never use PascalCase file names; the PascalCase name appears only in the barrel export.

## Good

```svelte
<!-- cards/icon-card/
     ├── icon-card.svelte
     ├── icon-card.types.ts
     ├── icon-card.constants.ts
     ├── icon-card.stories.svelte
     └── index.ts  →  export { default as IconCard } from './icon-card.svelte'; -->
<script lang="ts">
	import { IconCard } from '$lib/components/cards/icon-card';
</script>
```

## Bad

```svelte
<!-- cards/IconCard/
     ├── IconCard.svelte
     ├── iconCardTypes.ts
     └── constants.ts -->
<script lang="ts">
	import IconCard from '$lib/components/cards/IconCard/IconCard.svelte';
</script>
```
