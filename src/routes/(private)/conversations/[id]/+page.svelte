<script lang="ts">
	import { createConversationQuery } from '$lib/api-client/conversation/queries';
	import { PageContentContainer } from '$lib/components/utils/page-content-container';
	import { page } from '$app/state';
	import ContentCard from '$lib/components/utils/content-card.svelte';
	import { InterlocutorDetails } from '$lib/features/conversations/pages/session/components';
	import { cn } from 'flowbite-svelte';

	const conversationQuery = createConversationQuery(page.params.id);

	const conversation = $derived(conversationQuery.data);
	const isLoading = $derived(conversationQuery.isLoading);
	const isError = $derived(conversationQuery.isError);
	const error = $derived(conversationQuery.error);

	const jsonString = $derived(conversation ? JSON.stringify(conversation, null, 2) : null);

	let isSidepanelOpened = $state(false);
</script>

<svelte:head>
	<title>Conversation {page.params.id}</title>
</svelte:head>

{#if !conversation}
	<!--  -->
{:else}
	<PageContentContainer layout="superwide">
		{#snippet header()}
			<!-- <ConversationDetails {conversation} /> -->
			<button onclick={() => (isSidepanelOpened = !isSidepanelOpened)}>
				{#if isSidepanelOpened}
					Close Sidepanel
				{:else}
					Open Sidepanel
				{/if}
			</button>
		{/snippet}

		<ContentCard
			class={cn(
				isSidepanelOpened && 'w-[70%]', //
				!isSidepanelOpened && 'w-full'
			)}
		>
			<div
				class={cn(
					'flex flex-col gap-16 mx-auto h-full', //
					!isSidepanelOpened && 'max-w-[1540px]'
				)}
			>
				<InterlocutorDetails {conversation} />

				<div class="flex flex-col gap-4 w-[80%]">
					Elit aliquip ex exercitation cupidatat ea veniam ipsum excepteur dolor anim aute nisi non id
					adipisicing. Consectetur commodo laborum excepteur est incididunt anim minim minim.
					Exercitation laborum irure minim dolore in voluptate exercitation ad proident cillum Lorem
					excepteur magna adipisicing consectetur. Aute mollit voluptate velit nostrud tempor aute
					deserunt dolor esse dolore fugiat ipsum mollit in. Proident duis enim ea elit adipisicing sint
					in elit ut laboris cillum nulla duis nulla deserunt. Deserunt et non fugiat. Aliquip labore do
					laboris est et mollit adipisicing commodo sit qui aliquip.
				</div>

				<div class="flex flex-col gap-4 w-[80%] self-end">
					Elit aliquip ex exercitation cupidatat ea veniam ipsum excepteur dolor anim aute nisi non id
					adipisicing. Consectetur commodo laborum excepteur est incididunt anim minim minim.
					Exercitation laborum irure minim dolore in voluptate exercitation ad proident cillum Lorem
					excepteur magna adipisicing consectetur. Aute mollit voluptate velit nostrud tempor aute
					deserunt dolor esse dolore fugiat ipsum mollit in. Proident duis enim ea elit adipisicing sint
					in elit ut laboris cillum nulla duis nulla deserunt. Deserunt et non fugiat. Aliquip labore do
					laboris est et mollit adipisicing commodo sit qui aliquip.
				</div>

				<span class="grow"></span>

				<textarea class="w-full"></textarea>
			</div>
		</ContentCard>

		<ContentCard
			class={cn(
				isSidepanelOpened && 'w-[30%]', //
				!isSidepanelOpened && 'w-0 overflow-hidden scale-x-0 hidden'
			)}
		>
			<h2>Conversation Details</h2>
		</ContentCard>
	</PageContentContainer>
{/if}
