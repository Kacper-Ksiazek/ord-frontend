<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		children?: Snippet;
	}

	const { class: customClass = '', children }: Props = $props();
</script>

<div class={cn('bg-line animate-pulse w-full h-full rounded-md', customClass)}>
	{@render children?.()}
</div>
