<script lang="ts">
	import { Button } from '$lib/components/buttons/button';
	import { Badge } from '$lib/components/utils/badge';
	import { getConversationContext } from '$conversations/pages/session/contexts/conversation-context.svelte';
	import {
		getSidepanelContext,
		openSummary
	} from '$conversations/pages/session/contexts/sidepanel-context.svelte';
	import { getMessagesContext } from '$conversations/pages/session/contexts/messages-context.svelte';
	import { getConversationTypeLabel, getConversationToneLabel } from '$conversations/shared/utils';
	import { E2E_TEST_IDS } from '$conversations/testing/test-ids';
	import { ChevronLeft, Columns2, PanelLeftClose } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	const conversation = getConversationContext();
	const sidepanelContext = getSidepanelContext();
	const messagesContext = getMessagesContext();

	const summaryLabel = $derived(
		sidepanelContext.isOpened ? 'Switch to full width layout' : 'Switch to split layout'
	);

	const hudIconButtonClass =
		'size-9! min-h-9 min-w-9 shrink-0 border-none p-0 hover:bg-accent-soft [&>span]:justify-center';
	const hudTextButtonClass =
		'h-9! min-h-9 shrink-0 border-none pl-2 pr-0 hover:bg-accent-soft [&>span]:justify-start';
	const hudButtonClass = $derived(
		sidepanelContext.isOpened ? hudIconButtonClass : hudTextButtonClass
	);
</script>

<div class="relative z-10 mb-3 shrink-0 w-full">
	<div class="flex w-full items-center gap-x-2 border-b border-line-subtle pb-2">
		<div class="flex min-w-0 flex-wrap items-center gap-y-1.5">
			<Button
				dataTestId={E2E_TEST_IDS.session.backButton}
				type="OUTLINED"
				variant="TEXT"
				ariaLabel="Go back"
				title="Go back"
				onClick={() => goto('/conversations')}
				class={hudButtonClass}
			>
				<span class="inline-flex items-center gap-1.5 text-sm leading-none">
					<ChevronLeft class="size-4 shrink-0" />
					{#if !sidepanelContext.isOpened}
						<span>Go back</span>
					{/if}
				</span>
			</Button>

			<span class="flex shrink-0 items-center px-2" aria-hidden="true">
				<span class="size-1 rounded-full bg-ink-subtle"></span>
			</span>

			<div class="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5">
				<span class="text-sm font-medium text-ink">{conversation.topic}</span>

				<div class="flex flex-wrap items-center gap-1.5" aria-label="Conversation settings">
					<Badge color="gray">{conversation.proficiencyLevel}</Badge>
					<Badge color="gray">{getConversationTypeLabel(conversation.type)}</Badge>
					<Badge color="gray">{getConversationToneLabel(conversation.aiTone)}</Badge>
				</div>
			</div>
		</div>

		<div class="min-w-0 flex-1" aria-hidden="true"></div>

		<Button
			dataTestId={E2E_TEST_IDS.session.summaryToggle}
			type="OUTLINED"
			variant="TEXT"
			ariaLabel={summaryLabel}
			title={summaryLabel}
			disabled={messagesContext.messages.length < 2}
			onClick={() => {
				if (sidepanelContext.isOpened) {
					sidepanelContext.isOpened = false;
					sidepanelContext.filterMessageOrder = null;
				} else {
					openSummary(sidepanelContext, 'verdict');
				}
			}}
			class={hudButtonClass}
		>
			<span class="inline-flex items-center gap-1.5 text-sm leading-none">
				{#if sidepanelContext.isOpened}
					<PanelLeftClose class="size-4 shrink-0" />
				{:else}
					<Columns2 class="size-4 shrink-0" />
				{/if}
				{#if !sidepanelContext.isOpened}
					<span>View summary</span>
				{/if}
			</span>
		</Button>
	</div>
</div>
