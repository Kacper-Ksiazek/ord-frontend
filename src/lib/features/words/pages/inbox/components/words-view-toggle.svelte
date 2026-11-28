<script lang="ts">
	import type { WordsInboxViewMode } from '$words/types';
	import { ChartColumn, LayoutList, Sparkles } from 'lucide-svelte';
	import { cn } from '$lib/utils/cn';
	import * as m from '$lib/paraglide/messages.js';
	import { E2E_TEST_IDS } from '$words/testing/test-ids';

	interface Props {
		viewMode: WordsInboxViewMode;
		onViewModeChange: (mode: WordsInboxViewMode) => void;
	}

	let { viewMode, onViewModeChange }: Props = $props();

	const options: {
		mode: WordsInboxViewMode;
		label: () => string;
		icon: typeof LayoutList;
	}[] = [
		{ mode: 'list', label: () => m['features.words.inbox.view.list'](), icon: LayoutList },
		{
			mode: 'analytics',
			label: () => m['features.words.inbox.view.analytics'](),
			icon: ChartColumn
		},
		{
			mode: 'recommend',
			label: () => m['features.words.inbox.view.recommend'](),
			icon: Sparkles
		}
	];
</script>

<div
	class="flex w-full rounded-xl border border-line bg-surface p-1 sm:inline-flex sm:w-auto"
	role="tablist"
	aria-label={m['features.words.inbox.view.aria_label']()}
	data-testid={E2E_TEST_IDS.inbox.viewToggle}
>
	{#each options as option (option.mode)}
		{@const Icon = option.icon}
		{@const isSelected = viewMode === option.mode}
		<button
			type="button"
			role="tab"
			class={cn(
				'inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium whitespace-nowrap transition-colors sm:flex-none sm:gap-2 sm:px-4',
				isSelected && 'bg-accent-soft text-ink',
				!isSelected && 'text-ink-muted hover:text-ink'
			)}
			aria-selected={isSelected}
			title={option.label()}
			data-testid={E2E_TEST_IDS.inbox.viewToggleOption(option.mode)}
			onclick={() => onViewModeChange(option.mode)}
		>
			<Icon class="h-4 w-4 shrink-0" aria-hidden="true" />
			<span class="truncate">{option.label()}</span>
		</button>
	{/each}
</div>
