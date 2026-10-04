<script lang="ts">
	import Skeleton from '$lib/components/utils/skeleton.svelte';
	import type { ConversationAIInterlocutorAvatarId } from '$conversations/types';
	import {
		CONVERSATION_AVATAR_FALLBACK_ID,
		resolveConversationAvatarId
	} from '$conversations/shared/utils';
	import { cn } from '$lib/utils/cn';

	const avatarsModules = import.meta.glob('$lib/assets/images/conversation/avatars/*/*.jpg', {
		eager: false,
		query: { as: 'url' },
		import: 'default'
	});

	interface Props {
		class?: string;
		avatarId: ConversationAIInterlocutorAvatarId;
		size: 'fullsize' | 'thumbnail';
	}

	const { class: customClass = '', avatarId, size }: Props = $props();

	const resolvedAvatarId = $derived(resolveConversationAvatarId(avatarId));

	async function loadAvatarDynamically(id: ConversationAIInterlocutorAvatarId): Promise<string> {
		const normalizedSize = size === 'fullsize' ? '512x512' : '48x48';

		for (const candidate of [id, CONVERSATION_AVATAR_FALLBACK_ID]) {
			const normalizedId = candidate.split('_')[1].toLowerCase();
			const path = `/src/lib/assets/images/conversation/avatars/${normalizedId}/${normalizedSize}.jpg`;

			if (avatarsModules[path]) {
				return avatarsModules[path]() as Promise<string>;
			}
		}

		throw new Error(
			`Avatar ID "${id}" not found. Available avatars: ${Object.keys(avatarsModules).join(', ')}`
		);
	}

	const sizeClass = size === 'fullsize' ? 'w-full h-full' : 'w-12 h-12';
</script>

{#await loadAvatarDynamically(resolvedAvatarId)}
	<Skeleton class={cn(sizeClass, customClass)} />
{:then avatarPath}
	<img
		src={avatarPath as string}
		alt={`AI Interlocutor Avatar ${avatarId}`}
		loading="lazy"
		class={cn(sizeClass, 'object-cover', customClass)}
	/>
{/await}
