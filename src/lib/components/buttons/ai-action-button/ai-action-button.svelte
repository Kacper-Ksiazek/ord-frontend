<script lang="ts">
	import { CircleCheck, CircleX, Sparkles } from 'lucide-svelte';
	import type { AiActionButtonProps } from './ai-action-button.types';
	import Stage from './components/stage.svelte';
	import { Spinner } from '$lib/components/utils/spinner';
	import * as m from '$lib/paraglide/messages.js';
	import { cn } from '$lib/utils/cn';

	let {
		status = $bindable('default'),
		disabled = false,
		labels,
		...rest
	}: AiActionButtonProps = $props();

	const defaultLabel = $derived(
		labels?.default ?? m['components.utils.generate-with-ai.button_label']()
	);
	const loadingLabel = $derived(
		labels?.loading ?? m['components.utils.generate-with-ai.generating']()
	);
	const successLabel = $derived(labels?.success ?? m['components.utils.generate-with-ai.success']());
	const failedLabel = $derived(labels?.failed ?? m['components.utils.generate-with-ai.failed']());

	$effect(() => {
		if (status === 'success' || status === 'failed') {
			setTimeout(() => {
				status = 'default';
			}, 2000);
		}
	});
</script>

<div class="relative overflow-hidden rounded-[10px]">
	{#snippet aiButton(opts?: { 'aria-hidden'?: boolean })}
		<button
			type="button"
			class={cn(
				'flex h-full w-full cursor-pointer items-center gap-1 rounded-[10px] border border-primary-600 px-3 py-2',
				!disabled && 'hover:bg-accent-soft hover:text-primary-600',
				disabled && 'cursor-not-allowed border-line bg-accent-soft text-ink-subtle'
			)}
			aria-hidden={opts?.['aria-hidden']}
			onclick={disabled || opts?.['aria-hidden'] ? undefined : rest.onclick}
		>
			<Sparkles class="size-4 shrink-0" aria-hidden="true" />
			<span>{defaultLabel}</span>
		</button>
	{/snippet}

	<Stage class="relative opacity-0!">
		{@render aiButton({
			'aria-hidden': true
		})}
	</Stage>

	{#if status === 'default'}
		<Stage>
			{@render aiButton()}
		</Stage>
	{:else if status === 'loading'}
		<Stage class="bg-accent-soft text-ink">
			<Spinner class="text-ink" />
			<span>{loadingLabel}</span>
		</Stage>
	{:else if status === 'success'}
		<Stage class="bg-emerald-50">
			<CircleCheck class="h-5 w-5 text-emerald-600" aria-hidden="true" />
			<span>{successLabel}</span>
		</Stage>
	{:else if status === 'failed'}
		<Stage class="bg-red-50">
			<CircleX class="h-5 w-5 text-danger" aria-hidden="true" />
			<span>{failedLabel}</span>
		</Stage>
	{/if}
</div>
