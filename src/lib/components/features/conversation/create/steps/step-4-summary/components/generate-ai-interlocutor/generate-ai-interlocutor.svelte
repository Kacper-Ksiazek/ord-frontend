<script lang="ts">
	import { createGenerateAiInterlocutorMutation } from '$lib/api-client/conversation/mutations/use-generate-ai-interlocutor';
	import {
		getCreateConversationPayload,
		setCreateConversationPayload
	} from '../../../../stores/create-conversation-payload.svelte';
	import AIInterlocutorAvatar from '$lib/components/features/conversation/ai-interlocutor-avatar.svelte';
	import Skeleton from '$lib/components/utils/skeleton.svelte';
	import {
		getRecentInterlocutorsFromLocalStorage,
		saveNewInterlocutorToLocalStorage
	} from './utils';
	import { cn } from 'flowbite-svelte';
	import { conversationTypes } from '../../../step-1-conversation-type/conversation-types.constants';
	import * as m from '$lib/paraglide/messages.js';

	let isGenerating = $state(false);
	let hasAutoFetched = $state(false);

	const { mutateAsync: handleGenerateInterlocutor } = createGenerateAiInterlocutorMutation();

	const payload = getCreateConversationPayload();
	const hasGeneratedInterlocutor = $derived(
		!!(payload.aiInterlocutorName && payload.aiInterlocutorAvatarId)
	);

	const canGenerate = $derived(!!(payload.type && payload.topic && payload.language));

	const conversationTypeLabel = $derived.by(() => {
		if (!payload.type) return null;
		return conversationTypes.find((t) => t.type === payload.type)?.label ?? null;
	});

	async function generateInterlocutor() {
		if (!canGenerate || !payload.type || !payload.topic || !payload.language) {
			return;
		}

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

<section class="flex flex-col gap-4 max-w-[600px] mx-auto">
	<h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center">
		{m['features.conversation.create.step-4.ai_interlocutor.title']()}
	</h2>

	{#if isGenerating}
		<div class="flex flex-col items-center gap-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg relative">
			<Skeleton class="w-[512px] aspect-square rounded-full" />
			<Skeleton class="h-8 w-64" />
		</div>
	{:else if hasGeneratedInterlocutor}
		<div class="flex flex-col items-center gap-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg relative">
			<button
				onclick={generateInterlocutor}
				disabled={!canGenerate || isGenerating}
				class={cn(
					'absolute top-4 right-4 p-2 rounded-lg transition-colors',
					'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
					'hover:bg-gray-300 dark:hover:bg-gray-600',
					'disabled:opacity-50 disabled:cursor-not-allowed',
					'cursor-pointer'
				)}
				title="Generate a different AI interlocutor"
			>
				<svg
					class="w-6 h-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
					/>
				</svg>
			</button>

			<div class="w-[512px] aspect-square">
				<AIInterlocutorAvatar
					avatarId={payload.aiInterlocutorAvatarId!}
					size="fullsize"
					class="rounded-full"
				/>
			</div>

			<h3 class="text-2xl font-semibold text-gray-900 dark:text-gray-200">
				{payload.aiInterlocutorName}
			</h3>
		</div>
	{:else}
		<div
			class="w-full min-h-[200px] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center"
		>
			<p class="text-sm text-gray-400 dark:text-gray-500">
				{!payload.topic
					? m['features.conversation.create.step-4.ai_interlocutor.failed']()
					: m['features.conversation.create.step-4.ai_interlocutor.generating']()}
			</p>
		</div>
	{/if}
</section>
