<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';

	interface MessageBaseProps {
		wrapperClass?: string;
		messageClass?: string;
		content?: Snippet;
		footer?: Snippet;
		avatar?: Snippet;
		orientation?: 'left' | 'right';
	}

	const {
		wrapperClass = '', //
		messageClass = '',
		orientation = 'left',
		avatar,
		content,
		footer
	}: MessageBaseProps = $props();
</script>

<div
	class={cn(
		'flex gap-4', //
		orientation === 'right' ? 'flex-row-reverse self-end' : 'flex-row self-start'
	)}
>
	{#if avatar}
		<div class="mt-4">
			{@render avatar?.()}
		</div>
	{/if}

	<div
		class={cn(
			'max-w-[80%] w-full text-sm flex flex-col', //
			wrapperClass
		)}
		transition:fade={{ duration: 150 }}
	>
		{#if content}
			<div
				class={cn(
					'px-4 py-2 rounded-lg leading-[1.8] tracking-wide min-w-[84px] min-h-[84px] bg-slate-100', //
					messageClass
				)}
			>
				{@render content()}
			</div>
		{/if}

		{@render footer?.()}
	</div>
</div>
