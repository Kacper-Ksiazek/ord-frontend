<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';

	interface MessageBaseProps {
		wrapperClass?: string;
		messageClass?: string;
		orientation?: 'left' | 'right';

		content?: Snippet;
		footer?: Snippet;
		afterCard?: Snippet;
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
		afterCard,
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
		{#if content || footer}
			<div
				class={cn(
					'min-w-[68px] overflow-hidden rounded-[10px] border border-line bg-surface text-ink',
					messageClass
				)}
			>
				{#if content}
					<div class="px-4 py-2.5">
						<div class="message-body">
							{@render content()}
						</div>
					</div>
				{/if}

				{#if footer}
					<div class="border-t border-line-subtle px-4 py-1 [&:not(:has(*))]:hidden">
						{@render footer()}
					</div>
				{/if}
			</div>

			{#if afterCard}
				<div class="mt-3 w-full">
					{@render afterCard()}
				</div>
			{/if}
		{/if}
	</div>
</div>
