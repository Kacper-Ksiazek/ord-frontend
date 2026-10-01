<script lang="ts">
	import type { Snippet } from 'svelte';
	import { goto } from '$app/navigation';
	import { E2E_TEST_IDS } from '$home/testing/test-ids';
	import { IconButton } from '$lib/components/buttons/icon-button';
	import { CaptureWordsPopover } from '$words';
	import { BookOpen, ChevronRight, MessageSquare, MessageSquarePlus } from 'lucide-svelte';
	import HomeRecentConversationsList from './home-recent-conversations-list.svelte';
	import HomeRecentWordsList from './home-recent-words-list.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import {
		HOME_RECENT_CONVERSATIONS_SEED,
		HOME_RECENT_WORDS_SEED
	} from '../fixtures/home-recent-seed';

	const recentWords = HOME_RECENT_WORDS_SEED;
	const recentConversations = HOME_RECENT_CONVERSATIONS_SEED;
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
	<section class="flex min-w-0 flex-col gap-3" data-testid={E2E_TEST_IDS.home.recentWordsSection}>
		{@render sectionHeader(m['features.home.home.recent_words_title'](), BookOpen, wordsHeaderAction)}

		<HomeRecentWordsList items={recentWords} />

		{@render viewAllLink(
			'/words',
			m['features.home.home.recent_view_all_words'](),
			E2E_TEST_IDS.home.recentWordsViewAll
		)}
	</section>

	<section
		class="flex min-w-0 flex-col gap-3"
		data-testid={E2E_TEST_IDS.home.recentConversationsSection}
	>
		{@render sectionHeader(
			m['features.home.home.recent_conversations_title'](),
			MessageSquare,
			conversationsHeaderAction
		)}

		<HomeRecentConversationsList items={recentConversations} />

		{@render viewAllLink(
			'/conversations',
			m['features.home.home.recent_view_all_conversations'](),
			E2E_TEST_IDS.home.recentConversationsViewAll
		)}
	</section>
</div>

{#snippet wordsHeaderAction()}
	<CaptureWordsPopover
		isSidebarExpanded={false}
		triggerVariant="header-icon"
		triggerDataTestId={E2E_TEST_IDS.home.recentAddWordButton}
	/>
{/snippet}

{#snippet conversationsHeaderAction()}
	<IconButton
		icon={MessageSquarePlus}
		type="FILLED"
		variant="PRIMARY"
		ariaLabel={m['features.home.home.recent_new_conversation']()}
		dataTestId={E2E_TEST_IDS.home.recentNewConversationButton}
		onClick={() => goto('/conversations/create')}
	/>
{/snippet}
