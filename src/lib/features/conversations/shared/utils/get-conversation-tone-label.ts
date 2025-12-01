import * as m from '$lib/paraglide/messages';
import type { ConversationAITone } from '$lib/types/conversation/domain/conversation';

export function getConversationToneLabel(tone: ConversationAITone) {
	const messageKey =
		`features.conversation.enums.conversation_tones.${tone}.label` as keyof typeof m;
	const messageFn = m[messageKey] as (() => string) | undefined;

	return messageFn?.() || tone;
}

export function getConversationToneDescription(tone: ConversationAITone) {
	const messageKey =
		`features.conversation.enums.conversation_tones.${tone}.description` as keyof typeof m;
	const messageFn = m[messageKey] as (() => string) | undefined;

	return messageFn?.() || '';
}

export function getConversationToneMessages(tone: ConversationAITone) {
	return {
		label: getConversationToneLabel(tone),
		description: getConversationToneDescription(tone)
	};
}
