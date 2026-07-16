# Thin routes

Files under `src/routes` are thin wrappers: they import a `*Screen` (or layout) component from a feature page barrel and render it, optionally passing route data. All business logic, state, and page chrome live inside the feature — never assembled in the route file.

## Good

```svelte
<!-- src/routes/(private)/conversations/create/+page.svelte -->
<script lang="ts">
	import { CreateConversationScreen } from '$conversations/pages/create';
</script>

<CreateConversationScreen />
```

```svelte
<!-- src/routes/(private)/+error.svelte -->
<script lang="ts">
	import { AppErrorScreen } from '$appLayouts';
</script>

<AppErrorScreen homeHref="/conversations" homeLabel="Go to Home" showHeader={false} />
```

## Bad

```svelte
<!-- src/routes/(private)/conversations/create/+page.svelte -->
<script lang="ts">
	import { createCreateConversationMutation } from '$conversations/api-client';
	import ContentCard from '$lib/components/utils/content-card.svelte';

	const mutation = createCreateConversationMutation(); // business logic in route
	let step = $state(1); // page state in route
</script>

<ContentCard><!-- chrome assembled in the route --></ContentCard>
```
