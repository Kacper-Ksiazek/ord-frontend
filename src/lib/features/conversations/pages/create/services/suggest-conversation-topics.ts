import { httpPostSuggestConversationTopics } from '$conversations/api-client/conversation/sse/http-post-suggest-conversation-topics';
import type { ConversationType, CreateConversationRequest } from '$conversations/types';

export interface SuggestConversationTopicsParams {
	conversationType: ConversationType;
	language: NonNullable<CreateConversationRequest['language']>;
	clueFromUser?: string;
	excludeTopics: string[];
	onTopic: (topic: string) => void;
}

export function suggestConversationTopics({
	conversationType,
	language,
	clueFromUser,
	excludeTopics,
	onTopic
}: SuggestConversationTopicsParams): Promise<void> {
	return new Promise((resolve, reject) => {
		httpPostSuggestConversationTopics({
			conversationType,
			language,
			clueFromUser,
			excludeTopics
		}).subscribe({
			next: (topic) => {
				if (typeof topic?.value === 'string') {
					onTopic(topic.value);
				} else {
					console.error('Topic is not a string', topic, typeof topic);
				}
			},
			error: () => {
				reject(new Error('Failed to generate topics'));
			},
			complete: () => {
				resolve();
			}
		});
	});
}
