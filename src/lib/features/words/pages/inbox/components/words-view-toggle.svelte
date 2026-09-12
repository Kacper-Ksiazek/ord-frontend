<script lang="ts">
	import type { Component } from 'svelte';
	import type { WordsInboxViewMode } from '$words/types';
	import { ChartColumn, LayoutList } from 'lucide-svelte';
	import { cn } from '$lib/utils/cn';
	import * as m from '$lib/paraglide/messages.js';
	import { E2E_TEST_IDS } from '$words/testing/test-ids';

	interface Props {
		viewMode: WordsInboxViewMode;
		onViewModeChange: (mode: WordsInboxViewMode) => void;
	}

	let { viewMode, onViewModeChange }: Props = $props();

	const options: { mode: WordsInboxViewMode; label: () => string; icon: Component }[] = [
		{ mode: 'list', label: () => m['features.words.inbox.view.list'](), icon: LayoutList },
		{
			mode: 'analytics',
			label: () => m['features.words.inbox.view.analytics'](),
			icon: ChartColumn
		}
	];
</script>

<div
	class="inline-flex rounded-xl border border-line bg-surface p-1"
	role="tablist"
	aria-label={m['features.words.inbox.view.aria_label']()}
	data-testid={E2E_TEST_IDS.inbox.viewToggle}
>
	{#each options as option (option.mode)}
		{@const Icon = option.icon}
		<button
			type="button"
			role="tab"
			class={cn(
				'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
				viewMode === option.mode ? 'bg-accent-soft text-ink' : 'text-ink-muted hover:text-ink'
			)}
			aria-selected={viewMode === option.mode}
			data-testid={E2E_TEST_IDS.inbox.viewToggleOption(option.mode)}
			onclick={() => onViewModeChange(option.mode)}
		>
			<Icon class="h-4 w-4 shrink-0" aria-hidden="true" />
			{option.label()}
		</button>
	{/each}
</div>
