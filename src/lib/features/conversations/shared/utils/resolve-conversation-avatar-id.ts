import type { ConversationAIInterlocutorAvatarId } from '$conversations/types';

/** API / AI may return `AVATAR_DEFAULT`; assets exist only for named avatars. */
export const CONVERSATION_AVATAR_FALLBACK_ID: ConversationAIInterlocutorAvatarId = 'AVATAR_ALPHA';

export function resolveConversationAvatarId(
	avatarId: ConversationAIInterlocutorAvatarId | string | null | undefined
): ConversationAIInterlocutorAvatarId {
	if (!avatarId || avatarId === 'AVATAR_DEFAULT') {
		return CONVERSATION_AVATAR_FALLBACK_ID;
	}

	return avatarId as ConversationAIInterlocutorAvatarId;
}
