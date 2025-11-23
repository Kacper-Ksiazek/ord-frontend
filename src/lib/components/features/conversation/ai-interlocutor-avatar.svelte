<script lang="ts">
import clsx from 'clsx';
import Skeleton from '$lib/components/utils/skeleton.svelte';
import type { ConversationAIInterlocutorAvatarId } from '$lib/types/conversation/domain/conversation';

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

async function loadAvatarDynamically(
	avatarId: ConversationAIInterlocutorAvatarId
): Promise<string> {
	const normalizedId = avatarId.split('_')[1].toLowerCase();
	const normalizedSize = size === 'fullsize' ? '512x512' : '48x48';
	const path = `/src/lib/assets/images/conversation/avatars/${normalizedId}/${normalizedSize}.jpg`;

	if (!avatarsModules[path]) {
		throw new Error(
			`Avatar ID "${avatarId}" not found. Available avatars: ${Object.keys(avatarsModules).join(', ')}`
		);
	}

	return avatarsModules[path]() as Promise<string>;
}

const sizeClass = size === 'fullsize' ? 'w-full h-full' : 'w-12 h-12';
</script>

{#await loadAvatarDynamically(avatarId)}
  <Skeleton class={clsx(customClass, sizeClass)} />
{:then avatarPath}
  <img
    src={avatarPath as string}
    alt={`AI Interlocutor Avatar ${avatarId}`}
    loading="lazy"
    class={clsx(customClass, sizeClass)}
  />
{/await}
