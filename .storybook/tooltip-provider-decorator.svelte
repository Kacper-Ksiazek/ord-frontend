<script lang="ts">
	import { Tooltip } from 'bits-ui';
	import type { Snippet } from 'svelte';

	const { children }: { children: Snippet } = $props();
</script>

<Tooltip.Provider delayDuration={200}>
	{@render children()}
</Tooltip.Provider>
