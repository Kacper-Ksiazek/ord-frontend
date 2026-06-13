<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';

	let { children, class: customClass = '' } = $props<{
		children: Snippet;
		class?: string;
	}>();
</script>

<div
	transition:fade={{ duration: 200 }}
	class={cn(
		'absolute inset-0 flex items-center justify-center gap-1 w-full h-full',
		'text-sm',
		customClass
	)}
>
	{@render children()}
</div>
