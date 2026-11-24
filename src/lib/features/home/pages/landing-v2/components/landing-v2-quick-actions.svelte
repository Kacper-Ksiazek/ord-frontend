<script lang="ts">
	import { BookOpen, CirclePlus, MessageSquarePlus } from 'lucide-svelte';
	import { CaptureWordsPopover } from '$words';
	import { E2E_TEST_IDS } from '$home/testing/test-ids';
	import { cn } from '$lib/utils/cn';
	import * as m from '$lib/paraglide/messages.js';

	interface Props {
		wordsTotal: number | null;
	}

	let { wordsTotal }: Props = $props();

	const baseClass =
		'inline-flex h-11 items-center gap-2.5 rounded-full border pr-5 pl-1.5 text-[15px] font-semibold shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25 focus-visible:ring-offset-2 focus-visible:ring-offset-surface';
	const primaryClass = 'border-ink bg-ink text-canvas hover:bg-ink/90';
	const secondaryClass = 'border-line bg-surface text-ink hover:border-ink/30 hover:bg-accent-soft';
	const iconBubbleClass = 'flex size-8 shrink-0 items-center justify-center rounded-full';
</script>

<nav
	class="flex flex-wrap items-center justify-center gap-3"
	aria-label={m['features.home.landing-v2.quick_actions_label']()}
	data-testid={E2E_TEST_IDS.landingV2.quickActions}
>
	<a
		href="/conversations/create"
		class={cn(baseClass, primaryClass)}
		data-testid={E2E_TEST_IDS.landingV2.actionNewConversation}
	>
		<span class={cn(iconBubbleClass, 'bg-canvas/15')} aria-hidden="true">
			<MessageSquarePlus class="size-4" />
		</span>
		{m['features.home.landing-v2.actions.new_conversation_title']()}
	</a>

	<CaptureWordsPopover isSidebarExpanded={false}>
		{#snippet trigger({ open })}
			<button
				type="button"
				class={cn(baseClass, secondaryClass)}
				data-testid={E2E_TEST_IDS.landingV2.actionAddWords}
				onclick={open}
			>
				<span class={cn(iconBubbleClass, 'bg-highlight/70 text-ink')} aria-hidden="true">
					<CirclePlus class="size-4" />
				</span>
				{m['features.home.landing-v2.actions.add_words_title']()}
			</button>
		{/snippet}
	</CaptureWordsPopover>

	<a
		href="/words"
		class={cn(baseClass, secondaryClass)}
		data-testid={E2E_TEST_IDS.landingV2.actionWordsList}
	>
		<span class={cn(iconBubbleClass, 'bg-accent-soft text-ink')} aria-hidden="true">
			<BookOpen class="size-4" />
		</span>
		{m['features.home.landing-v2.actions.words_list_title']()}
		{#if wordsTotal !== null}
			<span
				class="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-ink-muted tabular-nums"
			>
				{wordsTotal}
			</span>
		{/if}
	</a>
</nav>
