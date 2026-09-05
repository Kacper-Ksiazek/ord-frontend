<script lang="ts">
	import type { WordsViewMode } from '$words/types';
	import * as m from '$lib/paraglide/messages.js';
	import { E2E_TEST_IDS } from '$words/testing/test-ids';

	interface Props {
		viewMode: WordsViewMode;
		onViewModeChange: (mode: WordsViewMode) => void;
	}

	let { viewMode, onViewModeChange }: Props = $props();

	const options: { mode: WordsViewMode; label: () => string }[] = [
		{ mode: 'learning', label: () => m['features.words.inbox.view.learning']() },
		{ mode: 'pending', label: () => m['features.words.inbox.view.pending']() }
	];
</script>

<div
	class="inline-flex rounded-xl border border-line bg-surface p-1"
	role="tablist"
	aria-label={m['features.words.inbox.view.aria_label']()}
	data-testid={E2E_TEST_IDS.inbox.viewToggle}
>
	{#each options as option (option.mode)}
		<button
			type="button"
			role="tab"
			class="rounded-lg px-4 py-2 text-sm font-medium transition-colors {viewMode === option.mode
				? 'bg-accent-soft text-ink'
				: 'text-ink-muted hover:text-ink'}"
			aria-selected={viewMode === option.mode}
			data-testid={E2E_TEST_IDS.inbox.viewToggleOption(option.mode)}
			onclick={() => onViewModeChange(option.mode)}
		>
			{option.label()}
		</button>
	{/each}
</div>
