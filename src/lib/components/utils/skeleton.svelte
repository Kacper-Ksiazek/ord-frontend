<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		children?: Snippet;
	}

	const { class: customClass = '', children }: Props = $props();
</script>

<div class={cn('animate-pulse rounded-md bg-accent-soft w-full h-full', customClass)}>
	{@render children?.()}
</div>
