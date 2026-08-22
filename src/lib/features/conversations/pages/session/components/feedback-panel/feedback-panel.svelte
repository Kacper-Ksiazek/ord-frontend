<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { getSidepanelContext } from '../../contexts/sidepanel-context.svelte';
	import { getSidepanelWidth } from '../constants.svelte';
	import { fade } from 'svelte/transition';
	import { ConversationSummaryView } from './views';
	import { E2E_TEST_IDS } from '$conversations/testing/test-ids';

	const sidepanelContext = getSidepanelContext();
	const sidepanelWidth = $derived(getSidepanelWidth());
</script>

<div
	data-testid={E2E_TEST_IDS.session.feedbackPanel}
	class={cn(
		'flex flex-col transition-transform duration-300 origin-right h-full relative',
		'bg-surface border-l border-line-subtle overflow-hidden'
	)}
	style={sidepanelContext.isOpened ? `width: ${sidepanelWidth}px` : 'width: 0px'}
>
	{#if !sidepanelContext.isOpened}
		<div
			class="absolute top-0 left-0 w-full h-full cursor-pointer"
			transition:fade={{ duration: 100 }}
		></div>
	{/if}

	<div class={cn('flex-1 min-h-0 overflow-hidden px-6 py-6 text-ink')}>
		<ConversationSummaryView />
	</div>
</div>
