<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		class?: string;
		children: Snippet;
	}

	const { class: customClass = '', children, ...restProps }: Props = $props();
</script>

<div
	{...restProps}
	class={cn(
		'bg-slate-50 dark:bg-slate-800 rounded-2xl px-4 py-8 flex flex-col w-full', //
		customClass
	)}
>
	{@render children()}
</div>
