import type { CompactConversationMessage } from '$conversations/types/domain/conversation-message';
import type { AggregatedLearningTip } from './aggregate-learning-tips.types';

export function aggregateLearningTips(
	messages: CompactConversationMessage[]
): AggregatedLearningTip[] {
	const result: AggregatedLearningTip[] = [];

	for (const message of messages) {
		if (message.sender === 'USER' || !message.learningTips) continue;

		const createdAt = new Date(message.createdAt);

		result.push(
			...[
				...message.learningTips.grammarTips.map<AggregatedLearningTip>((el) => ({
					type: 'GRAMMAR',
					data: el,
					phrase: el.phrase,
					register: el.register,
					createdAt,
					searchableText: `${el.phrase} ${el.grammarPoint} ${el.explanation}`.toLowerCase()
				})),

				...message.learningTips.phraseTips.map<AggregatedLearningTip>((el) => ({
					type: 'PHRASES',
					data: el,
					phrase: el.phrase,
					register: el.register,
					createdAt,
					searchableText: `${el.phrase} ${el.meaning}`.toLowerCase()
				})),

				...message.learningTips.vocabularyTips.map<AggregatedLearningTip>((el) => ({
					type: 'VOCABULARY',
					data: el,
					phrase: el.word,
					register: el.register,
					createdAt,
					searchableText: `${el.word} ${el.definition} ${el.usageNote}`.toLowerCase()
				}))
			]
		);
	}

	return result;
}
