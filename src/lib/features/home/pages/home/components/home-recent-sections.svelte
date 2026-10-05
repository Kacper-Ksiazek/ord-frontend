<script lang="ts">
	import type { Snippet } from 'svelte';
	import { goto } from '$app/navigation';
	import { E2E_TEST_IDS } from '$home/testing/test-ids';
	import { Button } from '$lib/components/buttons/button';
	import { CaptureWordsPopover } from '$words';
	import { cn } from '$lib/utils/cn';
	import { BookOpen, ChevronRight, MessageSquare, MessageSquarePlus } from 'lucide-svelte';
	import HomeRecentConversationsList from './home-recent-conversations-list.svelte';
	import HomeRecentWordsList from './home-recent-words-list.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import type { HomeRecentConversation, HomeRecentWord } from '$home/types';

	interface Props {
		recentWords: HomeRecentWord[];
		recentConversations: HomeRecentConversation[];
	}

	const { recentWords, recentConversations }: Props = $props();
</script>

{#snippet viewAllLink(href: string, label: string, testId: string)}
	<a
		{href}
		class="inline-flex items-center gap-1 text-sm text-ink-muted underline-offset-2 hover:text-ink hover:underline"
		data-testid={testId}
	>
		{label}
		<ChevronRight class="size-4 shrink-0" aria-hidden="true" />
	</a>
{/snippet}

{#snippet sectionHeader(title: string, HeaderIcon: LucideIcon, action: Snippet)}
	<div class="flex items-center justify-between gap-3">
		<div class="flex min-w-0 items-center gap-2">
			<HeaderIcon class="size-5 shrink-0 text-ink-muted" aria-hidden="true" />
			<h2 class="text-base font-semibold tracking-tight text-ink">{title}</h2>
		</div>
		{@render action()}
	</div>
{/snippet}

<div class="grid w-full grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-x-10 lg:gap-y-6">
	<section
		class={cn('flex min-w-0 flex-col gap-3', recentWords.length === 0 && 'min-h-[360px]')}
		data-testid={E2E_TEST_IDS.home.recentWordsSection}
	>
		{@render sectionHeader(m['features.home.home.recent_words_title'](), BookOpen, wordsHeaderAction)}

		<div class={cn(recentWords.length === 0 && 'flex min-h-0 flex-1 flex-col')}>
			<HomeRecentWordsList items={recentWords} />
		</div>

		{#if recentWords.length > 0}
			{@render viewAllLink(
				'/words',
				m['features.home.home.recent_view_all_words'](),
				E2E_TEST_IDS.home.recentWordsViewAll
			)}
		{/if}
	</section>

	<section
		class={cn('flex min-w-0 flex-col gap-3', recentConversations.length === 0 && 'min-h-[360px]')}
		data-testid={E2E_TEST_IDS.home.recentConversationsSection}
	>
		{@render sectionHeader(
			m['features.home.home.recent_conversations_title'](),
			MessageSquare,
			conversationsHeaderAction
		)}

		<div class={cn(recentConversations.length === 0 && 'flex min-h-0 flex-1 flex-col')}>
			<HomeRecentConversationsList items={recentConversations} />
		</div>

		{#if recentConversations.length > 0}
			{@render viewAllLink(
				'/conversations',
				m['features.home.home.recent_view_all_conversations'](),
				E2E_TEST_IDS.home.recentConversationsViewAll
			)}
		{/if}
	</section>
</div>

{#snippet wordsHeaderAction()}
	<CaptureWordsPopover
		isSidebarExpanded={false}
		triggerVariant="header-icon"
		triggerDataTestId={E2E_TEST_IDS.home.recentAddWordButton}
		triggerLabel={m['features.home.home.recent_add_word']()}
	/>
{/snippet}

{#snippet conversationsHeaderAction()}
	<Button
		type="FILLED"
		variant="PRIMARY"
		dataTestId={E2E_TEST_IDS.home.recentNewConversationButton}
		ariaLabel={m['features.home.home.recent_new_conversation']()}
		class="gap-2"
		onClick={() => goto('/conversations/create')}
	>
		<MessageSquarePlus class="size-4 shrink-0" aria-hidden="true" />
		{m['features.home.home.recent_new_conversation']()}
	</Button>
{/snippet}
