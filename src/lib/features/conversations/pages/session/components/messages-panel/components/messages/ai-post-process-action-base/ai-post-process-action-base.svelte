<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import { Sparkles } from 'lucide-svelte';
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';
	import ToggleIconsInHighlight from './components/toggle-icons-in-highlight.svelte';
	import ToggleExpandCollapse from './components/toggle-expand-collapse.svelte';
	import PreviewContent from './components/preview-content.svelte';

	interface LearningTipsProps {
		label: string;
		class?: string;
		isSelected?: boolean;
		isGenerating?: boolean;
		enableExpandCollapse?: boolean;
		showIconsInHighlightedParts: boolean;
		onPreviewContentClick?: () => void;
		children: Snippet;
		badges?: Snippet;
	}

	let {
		showIconsInHighlightedParts = $bindable(),

		label,
		class: customClass = '',
		isSelected = false,
		isGenerating = false,
		enableExpandCollapse = false,

		onPreviewContentClick,
		badges,
		children
	}: LearningTipsProps = $props();

	let isCollapsed = $state(true);

	const id = `ai-post-process-action-base-${crypto.randomUUID()}`;
</script>

<div
	{id}
	transition:fade
	class={cn(
		'flex flex-col gap-3 px-4 py-3 mt-2 rounded-lg w-full relative', //
		'bg-gray-50  dark:text-gray-200',
		customClass,
		isGenerating && 'generation-in-progress'
	)}
>
	<div class="absolute top-2 right-4 flex items-center gap-1">
		{#if onPreviewContentClick}
			<PreviewContent {isSelected} onClick={onPreviewContentClick} />
		{/if}

		<ToggleIconsInHighlight bind:showIconsInHighlightedParts />

		{#if enableExpandCollapse}
			<ToggleExpandCollapse bind:isCollapsed />
		{/if}
	</div>

	<div class="w-full flex gap-2 text-gray-600 dark:bg-gray-800">
		<div
			class={cn(
				'flex text-gray-500 dark:text-gray-400 items-center gap-2 flex-1',
				isGenerating && 'text-gray-400 dark:text-gray-400'
			)}
		>
			<Sparkles class="w-4.5 h-4.5" />
			<span class="font-medium">{label}</span>
		</div>
	</div>

	<div class="flex flex-col mt-1">
		<div class="flex flex-row gap-2 items-center justify-between">
			<div class="flex flex-row gap-2 overflow-x-auto min-w-0">
				{#if badges}
					{@render badges()}
				{/if}
			</div>
		</div>

		{#if !isCollapsed || !enableExpandCollapse}
			{@render children()}
		{/if}
	</div>
</div>
