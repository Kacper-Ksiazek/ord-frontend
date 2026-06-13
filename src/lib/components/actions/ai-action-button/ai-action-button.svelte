<script lang="ts">
	import { Button, type ButtonProps, cn, Spinner } from 'flowbite-svelte';
	import { CircleCheck, CircleX, Sparkles } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';
	import type { AiActionButtonProps } from './ai-action-button.types';
	import Stage from './components/stage.svelte';

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

<div class="relative overflow-hidden rounded-xl">
	{#snippet aiButton(props?: ButtonProps)}
		<Button
			class={cn(
				'cursor-pointer', //
				'w-full h-full flex items-center gap-1 border-primary-600 border rounded-xl',
				!disabled && 'hover:bg-primary-50! hover:text-primary-600',
				disabled && 'cursor-not-allowed bg-gray-200! text-gray-500! border-gray-300!'
			)}
			{...props}
		>
			<Sparkles class="size-4 shrink-0" aria-hidden="true" />
			<span>{defaultLabel}</span>
		</Button>
	{/snippet}

	<!-- Keep it like this in order to reserve space for all the stages -->
	<Stage class="relative opacity-0!">
		{@render aiButton({
			'aria-hidden': true
		})}
	</Stage>

	{#if status === 'default'}
		<Stage>
			{@render aiButton({
				...rest,
				onclick: disabled ? undefined : rest.onclick
			})}
		</Stage>
		<!--  -->
	{:else if status === 'loading'}
		<Stage class="bg-gray-200 text-gray-700">
			<Spinner size="4" class="fill-gray-700" />
			<span>{loadingLabel}</span>
		</Stage>
		<!--  -->
	{:else if status === 'success'}
		<Stage class="bg-green-100">
			<CircleCheck class="w-5 h-5 text-green-500" aria-hidden="true" />
			<span>{successLabel}</span>
		</Stage>
		<!--  -->
	{:else if status === 'failed'}
		<Stage class="bg-red-200">
			<CircleX class="w-5 h-5 text-red-500" aria-hidden="true" />
			<span>{failedLabel}</span>
		</Stage>
	{/if}
</div>
