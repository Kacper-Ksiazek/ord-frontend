<script lang="ts">
	import { AiActionButton } from '$lib/components/utils/ai-action-button';
	import type { AiActionButtonStatus } from '$lib/components/utils/ai-action-button/ai-action-button.types';
	import { Input } from 'flowbite-svelte';
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

	let generateButtonStatus = $state<AiActionButtonStatus>('default');
	let additionalContext = $state('');
	let isGenerating = $state(false);

	const { mutateAsync: handleGenerateInterlocutor } = createGenerateAiInterlocutorMutation();

	const payload = getCreateConversationPayload();
	const hasGeneratedInterlocutor = $derived(
		!!(payload.aiInterlocutorName && payload.aiInterlocutorAvatarId)
	);

	async function generateInterlocutor() {
		if (!payload.type || !payload.topic || !payload.language) {
			return;
		}

		isGenerating = true;
		generateButtonStatus = 'loading';

		try {
			const result = await handleGenerateInterlocutor({
				topic: payload.topic,
				conversationType: payload.type,
				language: payload.language,
				additionalContext: additionalContext || undefined,
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

			generateButtonStatus = 'success';
		} catch (error) {
			console.error('Failed to generate AI interlocutor:', error);
			generateButtonStatus = 'failed';
		} finally {
			isGenerating = false;
		}
	}
</script>

<section class="flex flex-col gap-4">
	<div class="flex items-center gap-2">
		<AiActionButton
			status={generateButtonStatus}
			onclick={generateInterlocutor}
			disabled={!payload.type || !payload.topic || !payload.language}
		/>

		<Input
			placeholder="Additional context for the AI interlocutor... (optional)"
			class="flex-1"
			bind:value={additionalContext}
			disabled={isGenerating}
		/>
	</div>

	{#if hasGeneratedInterlocutor}
		<div class="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
			<div class="w-32 h-32">
				<AIInterlocutorAvatar
					avatarId={payload.aiInterlocutorAvatarId!}
					size="fullsize"
					class="rounded-full"
				/>
			</div>
			<p class="text-sm font-semibold text-gray-700 dark:text-gray-200">
				{payload.aiInterlocutorName}
			</p>
		</div>
	{:else if isGenerating}
		<div class="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
			<Skeleton class="w-32 h-32 rounded-full" />
			<Skeleton class="h-4 w-24" />
		</div>
	{:else}
		<div
			class="w-full min-h-[200px] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center"
		>
			<p class="text-sm text-gray-400 dark:text-gray-500">
				{!payload.topic
					? 'Select a topic first to generate an AI interlocutor'
					: 'Click the button above to generate an AI interlocutor'}
			</p>
		</div>
	{/if}
</section>
