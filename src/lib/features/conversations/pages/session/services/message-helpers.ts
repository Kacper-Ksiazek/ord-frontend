import type { CompactConversationMessage } from '$conversations/types';

export function findLatestAiMessageIndex(
	messages: CompactConversationMessage[],
	beforeIndex = messages.length
): number {
	for (let i = beforeIndex - 1; i >= 0; i--) {
		if (messages[i]?.sender === 'AI') {
			return i;
		}
	}

	return -1;
}

export function findLatestAiMessageContent(
	messages: CompactConversationMessage[],
	beforeIndex = messages.length
): string {
	const index = findLatestAiMessageIndex(messages, beforeIndex);

	return index >= 0 ? messages[index].content : '';
}

export function removeEmptyAiMessageAt(
	messages: CompactConversationMessage[],
	index: number
): void {
	const message = messages[index];
	if (message?.sender === 'AI' && !message.content) {
		messages.splice(index, 1);
	}
}
