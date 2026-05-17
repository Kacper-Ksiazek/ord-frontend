<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		layout?: 'narrow' | 'wide' | 'superwide';
		contentClass?: string;
		children: Snippet;
		header?: Snippet;
	}

	const {
		class: customClass = '',
		layout = 'narrow',
		contentClass = '',
		children,
		header
	}: Props = $props();

	const maxWidth = $derived(
		layout === 'superwide'
			? 'max-w-[2500px]'
			: layout === 'wide'
				? 'max-w-[1540px]'
				: 'max-w-[1200px]'
	);
</script>

<section
	class={cn(
		'w-full flex-1 mx-auto flex flex-col gap-6 h-full', //
		maxWidth,
		customClass
	)}
>
	{#if header}
		{@render header?.()}
	{/if}

	<div
		class={cn(
			'flex-1 flex gap-6 h-full', //
			contentClass
		)}
	>
		{@render children()}
	</div>
</section>
