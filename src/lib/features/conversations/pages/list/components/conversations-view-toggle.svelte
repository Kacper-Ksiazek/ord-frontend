<script lang="ts">
	import type { ConversationsListViewMode } from '$conversations/types';
	import { LayoutList, Sparkles } from 'lucide-svelte';
	import { cn } from '$lib/utils/cn';
	import * as m from '$lib/paraglide/messages.js';
	import { E2E_TEST_IDS } from '$conversations/testing/test-ids';

	interface Props {
		viewMode: ConversationsListViewMode;
		onViewModeChange: (mode: ConversationsListViewMode) => void;
	}

	let { viewMode, onViewModeChange }: Props = $props();

	const options: {
		mode: ConversationsListViewMode;
		label: () => string;
		icon: typeof LayoutList;
	}[] = [
		{ mode: 'list', label: () => m['features.conversation.list.view.list'](), icon: LayoutList },
		{
			mode: 'summary',
			label: () => m['features.conversation.list.view.summary'](),
			icon: Sparkles
		}
	];
</script>

<div
	class="inline-flex rounded-xl border border-line bg-surface p-1"
	role="tablist"
	aria-label={m['features.conversation.list.view.aria_label']()}
	data-testid={E2E_TEST_IDS.conversations.viewToggle}
>
	{#each options as option (option.mode)}
		{@const Icon = option.icon}
		{@const isSelected = viewMode === option.mode}
		<button
			type="button"
			role="tab"
			class={cn(
				'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
				isSelected && 'bg-accent-soft text-ink',
				!isSelected && 'text-ink-muted hover:text-ink'
			)}
			aria-selected={isSelected}
			data-testid={E2E_TEST_IDS.conversations.viewToggleOption(option.mode)}
			onclick={() => onViewModeChange(option.mode)}
		>
			<Icon class="h-4 w-4 shrink-0" aria-hidden="true" />
			{option.label()}
		</button>
	{/each}
</div>
