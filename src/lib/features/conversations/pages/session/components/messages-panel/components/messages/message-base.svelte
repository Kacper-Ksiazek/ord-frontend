<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';

	interface MessageBaseProps {
		wrapperClass?: string;
		messageClass?: string;
		orientation?: 'left' | 'right';

		content?: Snippet;
		footer?: Snippet;
		avatar?: Snippet;
		/** Stable selector for E2E tests (`data-testid`) */
		dataTestId?: string;
	}

	const {
		wrapperClass = '',
		messageClass = '',
		orientation = 'left',
		avatar,
		content,
		footer,
		dataTestId
	}: MessageBaseProps = $props();
</script>

<div
	data-testid={dataTestId}
	class={cn(
		'flex gap-4 w-full', //
		orientation === 'right' ? 'flex-row-reverse self-end' : 'flex-row self-start'
	)}
>
	{#if avatar}
		<div>
			{@render avatar?.()}
		</div>
	{/if}

	<div
		class={cn(
			'max-w-[80%] w-full flex flex-col', //
			wrapperClass
		)}
		transition:fade={{ duration: 150 }}
	>
		{#if content}
			<div
				class={cn(
					'px-4 py-2 rounded-lg min-w-[68px]', //
					'bg-white dark:bg-slate-800',
					messageClass
				)}
			>
				<p class="content-long">
					{@render content()}
				</p>
			</div>
		{/if}

		{@render footer?.()}
	</div>
</div>
