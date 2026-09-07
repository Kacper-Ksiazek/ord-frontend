<script lang="ts">
	import type { WordsViewMode } from '$words/types';
	import { cn } from '$lib/utils/cn';
	import * as m from '$lib/paraglide/messages.js';
	import { E2E_TEST_IDS } from '$words/testing/test-ids';

	interface Props {
		viewMode: WordsViewMode;
		pendingCount?: number;
		onViewModeChange: (mode: WordsViewMode) => void;
	}

	let { viewMode, pendingCount = 0, onViewModeChange }: Props = $props();

	const options: { mode: WordsViewMode; label: () => string }[] = [
		{ mode: 'learning', label: () => m['features.words.inbox.view.learning']() },
		{ mode: 'pending', label: () => m['features.words.inbox.view.pending']() }
	];

	function formatCount(count: number): string {
		return count > 99 ? '99+' : String(count);
	}

	function pendingBadgeClass(isSelected: boolean): string {
		return isSelected ? 'bg-surface text-ink' : 'bg-accent-soft text-ink-muted';
	}
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
			class={cn(
				'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
				viewMode === option.mode ? 'bg-accent-soft text-ink' : 'text-ink-muted hover:text-ink'
			)}
			aria-selected={viewMode === option.mode}
			data-testid={E2E_TEST_IDS.inbox.viewToggleOption(option.mode)}
			onclick={() => onViewModeChange(option.mode)}
		>
			{option.label()}
			{#if option.mode === 'pending' && pendingCount > 0}
				<span
					class={cn(
						'inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-semibold tabular-nums',
						pendingBadgeClass(viewMode === 'pending')
					)}
					data-testid={E2E_TEST_IDS.inbox.viewPendingCount}
				>
					{formatCount(pendingCount)}
				</span>
			{/if}
		</button>
	{/each}
</div>
