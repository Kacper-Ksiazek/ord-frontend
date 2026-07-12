import * as m from '$lib/paraglide/messages';
import type { ConversationType } from '$conversations/types';

export function getConversationTypeLabel(type: ConversationType) {
	const messageKey =
		`features.conversation.enums.conversation_types.${type}.label` as keyof typeof m;
	const messageFn = m[messageKey] as (() => string) | undefined;

	return messageFn?.() || type;
}

export function getConversationTypeDescription(type: ConversationType) {
	const messageKey =
		`features.conversation.enums.conversation_types.${type}.description` as keyof typeof m;
	const messageFn = m[messageKey] as (() => string) | undefined;

	return messageFn?.() || type;
}

export function getConversationTypeMessages(type: ConversationType) {
	return {
		label: getConversationTypeLabel(type),
		description: getConversationTypeDescription(type)
	};
}
