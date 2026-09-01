<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';

	interface Props {
		class?: string;
		children: Snippet;
	}

	const { class: className = '', children }: Props = $props();
</script>

<div
	role="alert"
	class={cn(
		'rounded-[10px] border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger',
		className
	)}
>
	{@render children()}
</div>
