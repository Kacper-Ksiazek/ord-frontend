import type { CompactConversationMessage } from '$conversations/types';
import type { AggregatedLearningTip } from './aggregate-learning-tips.types';

export function aggregateLearningTips(
	messages: CompactConversationMessage[]
): AggregatedLearningTip[] {
	const result: AggregatedLearningTip[] = [];

	for (let messageOrder = 0; messageOrder < messages.length; messageOrder++) {
		const message = messages[messageOrder];

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
					messageOrder,
					searchableText: `${el.phrase} ${el.grammarPoint} ${el.explanation}`.toLowerCase()
				})),

				...message.learningTips.phraseTips.map<AggregatedLearningTip>((el) => ({
					type: 'PHRASES',
					data: el,
					phrase: el.phrase,
					register: el.register,
					createdAt,
					messageOrder,
					searchableText: `${el.phrase} ${el.meaning}`.toLowerCase()
				})),

				...message.learningTips.vocabularyTips.map<AggregatedLearningTip>((el) => ({
					type: 'VOCABULARY',
					data: el,
					phrase: el.word,
					register: el.register,
					createdAt,
					messageOrder,
					searchableText: `${el.word} ${el.definition} ${el.usageNote}`.toLowerCase()
				}))
			]
		);
	}

	return result;
}
