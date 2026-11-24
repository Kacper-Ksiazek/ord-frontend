<script lang="ts">
	import { Bookmark, Sparkles } from 'lucide-svelte';
	import { cn } from '$lib/utils/cn';
	import * as m from '$lib/paraglide/messages.js';
	import { E2E_TEST_IDS } from '$conversations/testing/test-ids';

	export type TopicPickerTab = 'create' | 'saved';

	interface Props {
		activeTab: TopicPickerTab;
		savedCount: number;
		savedTabDisabled?: boolean;
		onTabChange: (tab: TopicPickerTab) => void;
	}

	let { activeTab, savedCount, savedTabDisabled = false, onTabChange }: Props = $props();

	const options: {
		id: TopicPickerTab;
		label: () => string;
		icon: typeof Sparkles;
	}[] = [
		{
			id: 'create',
			label: () => m['features.conversation.create.step-3.topic_picker.tabs.create'](),
			icon: Sparkles
		},
		{
			id: 'saved',
			label: () => m['features.conversation.create.step-3.topic_picker.tabs.saved_for_later'](),
			icon: Bookmark
		}
	];
</script>

<div
	class="inline-flex w-fit shrink-0 self-start rounded-xl border border-line bg-surface p-1"
	role="tablist"
	aria-label={m['features.conversation.create.step-3.header']()}
	data-testid={E2E_TEST_IDS.createConversation.topicPickerTabs}
>
	{#each options as option (option.id)}
		{@const Icon = option.icon}
		{@const isSelected = activeTab === option.id}
		{@const isDisabled = option.id === 'saved' && savedTabDisabled}
		<button
			type="button"
			role="tab"
			class={cn(
				'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
				isSelected && 'bg-accent-soft text-ink',
				!isSelected && !isDisabled && 'text-ink-muted hover:text-ink',
				isDisabled && 'cursor-not-allowed text-ink-subtle opacity-60'
			)}
			aria-selected={isSelected}
			aria-disabled={isDisabled}
			disabled={isDisabled}
			data-testid={E2E_TEST_IDS.createConversation.topicPickerTab(option.id)}
			onclick={() => {
				if (!isDisabled) {
					onTabChange(option.id);
				}
			}}
		>
			<Icon class="h-4 w-4 shrink-0" aria-hidden="true" />
			{option.label()}
			{#if option.id === 'saved'}
				<span class="text-xs">({savedCount})</span>
			{/if}
		</button>
	{/each}
</div>
