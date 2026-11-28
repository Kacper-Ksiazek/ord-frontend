<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { isMobile } from '$lib/utils/breakpoints.svelte';
	import { getSidepanelContext } from '../../contexts/sidepanel-context.svelte';
	import { getSidepanelWidth } from '../constants.svelte';
	import { fade } from 'svelte/transition';
	import { ConversationSummaryView } from './views';
	import { E2E_TEST_IDS } from '$conversations/testing/test-ids';

	const sidepanelContext = getSidepanelContext();
	const sidepanelWidth = $derived(getSidepanelWidth());
	/** On phones the summary replaces the messages column instead of sitting beside it. */
	const openedWidth = $derived(isMobile.current ? '100%' : `${sidepanelWidth}px`);
</script>

<div
	data-testid={E2E_TEST_IDS.session.feedbackPanel}
	class={cn(
		'flex flex-col transition-transform duration-300 origin-right h-full relative',
		'bg-surface border-l border-line-subtle overflow-hidden'
	)}
	style={sidepanelContext.isOpened ? `width: ${openedWidth}` : 'width: 0px'}
>
	{#if !sidepanelContext.isOpened}
		<div
			class="absolute top-0 left-0 w-full h-full cursor-pointer"
			transition:fade={{ duration: 100 }}
		></div>
	{/if}

	<div class={cn('flex-1 min-h-0 overflow-hidden px-4 py-4 text-ink md:px-6 md:py-6')}>
		<ConversationSummaryView />
	</div>
</div>
