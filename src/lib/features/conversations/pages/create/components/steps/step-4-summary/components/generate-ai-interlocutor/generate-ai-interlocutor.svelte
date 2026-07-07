<script lang="ts">
	import { createGenerateAiInterlocutorMutation } from '$conversations/api-client/conversation/mutations/use-generate-ai-interlocutor';
	import {
		getCreateConversationPayload,
		setCreateConversationPayload
	} from '$lib/features/conversations/pages/create/stores/create-conversation-payload.svelte';
	import AIInterlocutorAvatar from '$lib/features/conversations/shared/components/ai-interlocutor-avatar.svelte';
	import type { ConversationAIInterlocutorAvatarId } from '$conversations/types';
	import Skeleton from '$lib/components/utils/skeleton.svelte';
	import { IconButton } from '$lib/components/buttons/icon-button';
	import {
		getRecentInterlocutorsFromLocalStorage,
		saveNewInterlocutorToLocalStorage
	} from './utils';
	import { RefreshCw } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { cn } from 'flowbite-svelte';

	let isGenerating = $state(false);
	let hasAutoFetched = $state(false);
	let generationFailed = $state(false);

	const { mutateAsync: handleGenerateInterlocutor } = createGenerateAiInterlocutorMutation();

	const payload = getCreateConversationPayload();
	const hasGeneratedInterlocutor = $derived(
		!!(payload.aiInterlocutorName && payload.aiInterlocutorAvatarId)
	);

	const canGenerate = $derived(!!(payload.type && payload.topic && payload.language));

	async function generateInterlocutor() {
		if (!canGenerate || !payload.type || !payload.topic || !payload.language) {
			return;
		}

		generationFailed = false;
		isGenerating = true;

		try {
			const result = await handleGenerateInterlocutor({
				topic: payload.topic,
				conversationType: payload.type,
				language: payload.language,
				additionalContext: undefined,
				recentInterlocutors: getRecentInterlocutorsFromLocalStorage()
			});

			saveNewInterlocutorToLocalStorage({
				avatarId: result.avatarId,
				name: result.name
			});

			setCreateConversationPayload({
				aiInterlocutorName: result.name,
				aiInterlocutorAvatarId: result.avatarId
			});
		} catch (error) {
			console.error('Failed to generate AI interlocutor:', error);
			generationFailed = true;
		} finally {
			isGenerating = false;
		}
	}

	// Auto-fetch on mount, but only if not already generated and requirements are met
	$effect(() => {
		if (!hasAutoFetched && canGenerate && !hasGeneratedInterlocutor) {
			hasAutoFetched = true;
			generateInterlocutor();
		}
	});
</script>

{#snippet generated_avatar()}
	<div class="relative mx-auto flex w-full flex-col items-center gap-3">
		<IconButton
			icon={RefreshCw}
			ariaLabel={m['features.conversation.create.step-4.ai_interlocutor.regenerate_aria_label']()}
			tooltip={m['features.conversation.create.step-4.ai_interlocutor.regenerate_tooltip']()}
			disabled={!canGenerate || isGenerating}
			onClick={generateInterlocutor}
			variant="TEXT"
			type="OUTLINED"
			class="absolute right-0 top-0 z-10 shrink-0"
		/>

		<div
			class={cn(
				'avatar-regen-shell relative size-[320px] shrink-0 overflow-hidden rounded-full pt-4',
				isGenerating && 'avatar-regen-shell--busy'
			)}
			aria-busy={isGenerating}
		>
			<AIInterlocutorAvatar
				avatarId={payload.aiInterlocutorAvatarId as ConversationAIInterlocutorAvatarId}
				size="fullsize"
				class="size-full rounded-full"
			/>
		</div>

		<h3 class="heading-5 w-full text-center">
			{payload.aiInterlocutorName}
		</h3>
	</div>
{/snippet}

{#snippet generating_in_progress()}
	<div class="mx-auto flex w-full max-w-96 flex-col items-center gap-3">
		<Skeleton class="size-[320px] rounded-full" />
		<div class="flex min-h-10 w-full items-center justify-center px-2 text-center">
			<p class="caption">
				{m['features.conversation.create.step-4.ai_interlocutor.generating']()}
			</p>
		</div>
	</div>
{/snippet}

{#snippet generation_error_screen()}
	<div class="mx-auto flex w-full max-w-96 flex-col items-center gap-3">
		<div class="flex min-h-10 w-full flex-col items-center justify-center gap-2 px-2 text-center">
			<p class="body-small text-error">
				{m['features.conversation.create.step-4.ai_interlocutor.failed']()}
			</p>
			{#if canGenerate}
				<button
					type="button"
					disabled={isGenerating}
					class="link body-small font-semibold disabled:cursor-not-allowed disabled:opacity-50"
					onclick={() => generateInterlocutor()}
				>
					{m['features.conversation.create.step-4.ai_interlocutor.retry']()}
				</button>
			{/if}
		</div>
	</div>
{/snippet}

<section class="flex w-[360px] flex-col items-center gap-4">
	{#if hasGeneratedInterlocutor}
		{@render generated_avatar()}
	{:else if isGenerating}
		{@render generating_in_progress()}
	{:else if generationFailed || !canGenerate}
		{@render generation_error_screen()}
	{/if}
</section>

<style>
	@keyframes avatar-regen-pulse {
		0%,
		100% {
			opacity: 0.42;
		}
		50% {
			opacity: 0.88;
		}
	}

	.avatar-regen-shell--busy {
		filter: grayscale(1);
		animation: avatar-regen-pulse 1.15s ease-in-out infinite;
		pointer-events: none;
	}
</style>
