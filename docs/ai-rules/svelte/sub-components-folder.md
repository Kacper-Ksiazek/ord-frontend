# Private sub-components go in a nested `components/` folder

When a component has child components used only within it, place them in a `components/` subfolder inside the component's folder and import them by direct relative path (no barrel for private sub-components). Examples: `ai-action-button/components/`, `sidebar/components/`, `topic-picker/components/`.

## Good

```svelte
<!-- topic-picker/
     ├── topic-picker.svelte
     ├── index.ts
     └── components/
         ├── topic-row.svelte
         └── custom-topic-management.svelte -->

<script lang="ts">
	import TopicRow from './components/topic-row.svelte';
</script>
```

## Bad

```svelte
<!-- private sub-component dumped next to shared components,
     imported across the tree instead of being nested -->
<script lang="ts">
	import TopicRow from '$lib/components/topic-row.svelte';
</script>
```
