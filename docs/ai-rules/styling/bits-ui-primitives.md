# Build on bits-ui primitives

Overlays and interactive primitives come from bits-ui (headless). Style them with Quiet studio tokens (`canvas`, `ink`, `line`, `accent-soft`) and the shared `overlay-surface` class. Prefer repo wrappers (`$lib/components/buttons/button`, `$lib/components/forms/input`, `$lib/components/utils/badge`, `$lib/components/utils/spinner`) instead of reaching for bits-ui at call sites when a wrapper already exists.

## Good

```svelte
<script lang="ts">
	import { DropdownMenu } from 'bits-ui';
	import { Badge } from '$lib/components/utils/badge';
	import { Button } from '$lib/components/buttons/button';
	import { Spinner } from '$lib/components/utils/spinner';
	import { cn } from '$lib/utils/cn';

	let { loading = false, class: className = '' }: Props = $props();
</script>

<Badge class={cn('shrink-0', className)} color="primary">New</Badge>

<Button variant="PRIMARY" onClick={handleSave}>
	{#if loading}
		<Spinner />
	{/if}
	Save
</Button>
```

## Bad

```svelte
<!-- reimplementing bits-ui Dialog / DropdownMenu / Tooltip from scratch -->
<div class="absolute z-50 rounded border bg-white p-2">Menu</div>
```
