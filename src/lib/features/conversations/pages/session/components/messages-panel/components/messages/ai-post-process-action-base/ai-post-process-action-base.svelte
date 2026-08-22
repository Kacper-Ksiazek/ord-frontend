<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { Sparkles } from 'lucide-svelte';
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';
	import PreviewContent from './components/preview-content.svelte';

	interface AiPostProcessActionBaseProps {
		label: string;
		class?: string;
		isSelected?: boolean;
		isGenerating?: boolean;
		onPreviewContentClick?: (e: MouseEvent) => void;
		headerActions?: Snippet;
		playbackProgress?: Snippet;
		children?: Snippet;
		badges?: Snippet;
		/** Stable selector for E2E tests (`data-testid`) */
		dataTestId?: string;
	}

	let {
		label,
		class: customClass = '',
		isSelected = false,
		isGenerating = false,
		onPreviewContentClick,
		headerActions,
		playbackProgress,
		badges,
		children,
		dataTestId
	}: AiPostProcessActionBaseProps = $props();
</script>

<div
	data-testid={dataTestId}
	transition:fade
	class={cn(
		'flex w-full flex-col gap-1',
		customClass,
		isGenerating && 'generation-in-progress rounded-[10px] px-2 py-0.5'
	)}
>
	<div class="flex min-h-8 items-center gap-2">
		<div
			class={cn(
				'flex shrink-0 items-center gap-1.5 text-xs font-medium',
				isSelected ? 'text-ink' : 'text-ink-muted',
				isGenerating && 'text-ink-subtle'
			)}
		>
			<Sparkles class="size-3.5" />
			<span>{label}</span>
		</div>

		{#if badges}
			<div class="flex min-w-0 items-center gap-3 overflow-x-auto">
				{@render badges()}
			</div>
		{/if}

		<div class="ml-auto flex shrink-0 items-center">
			{#if headerActions}
				{@render headerActions()}
			{/if}

			{#if onPreviewContentClick}
				<PreviewContent {isSelected} onClick={onPreviewContentClick} />
			{/if}
		</div>
	</div>

	{#if playbackProgress}
		{@render playbackProgress()}
	{/if}

	{#if children}
		{@render children()}
	{/if}
</div>
