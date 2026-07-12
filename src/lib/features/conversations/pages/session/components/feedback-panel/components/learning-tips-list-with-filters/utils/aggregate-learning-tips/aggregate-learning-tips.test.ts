import { describe, it, expect } from 'vitest';
import type { CompactConversationMessage } from '$conversations/types';
import { aggregateLearningTips } from './aggregate-learning-tips';

function makeAiMessage(
	overrides: Partial<Extract<CompactConversationMessage, { sender: 'AI' }>> = {}
): CompactConversationMessage {
	return {
		sender: 'AI',
		content: 'Hello',
		learningTips: null,
		createdAt: '2025-01-01T12:00:00.000Z',
		...overrides
	};
}

describe('aggregateLearningTips', () => {
	describe('positive path', () => {
		it('should aggregate grammar, phrase, and vocabulary tips from AI messages', () => {
			const messages: CompactConversationMessage[] = [
				makeAiMessage({
					learningTips: {
						grammarTips: [
							{
								phrase: 'I am going',
								grammarPoint: 'present continuous',
								explanation: 'Use for planned actions',
								register: 'NEUTRAL',
								exampleSentences: ['I am going to the store.'],
								nativeLanguageEquivalent: 'Idę'
							}
						],
						phraseTips: [
							{
								phrase: 'break the ice',
								meaning: 'start a conversation',
								register: 'COLLOQUIAL',
								phraseType: 'IDIOMATIC',
								exampleSentences: ['He told a joke to break the ice.'],
								nativeLanguageEquivalent: 'przełamać lody'
							}
						],
						vocabularyTips: [
							{
								word: 'ubiquitous',
								definition: 'present everywhere',
								usageNote: 'formal contexts',
								register: 'FORMAL',
								wordType: 'ADJECTIVE',
								exampleSentences: ['Smartphones are ubiquitous.'],
								nativeLanguageEquivalent: 'wszechobecny'
							}
						]
					}
				})
			];

			const result = aggregateLearningTips(messages);

			expect(result).toHaveLength(3);
			expect(result.map((item) => item.type)).toEqual(['GRAMMAR', 'PHRASES', 'VOCABULARY']);
			expect(result[0].phrase).toBe('I am going');
			expect(result[1].searchableText).toContain('start a conversation');
			expect(result[2].register).toBe('FORMAL');
		});
	});

	describe('negative path', () => {
		it('should skip user messages and AI messages without learning tips', () => {
			const messages: CompactConversationMessage[] = [
				{
					sender: 'USER',
					content: 'Hi',
					analysis: null,
					createdAt: '2025-01-01T12:00:00.000Z'
				},
				makeAiMessage({ learningTips: null })
			];

			const result = aggregateLearningTips(messages);

			expect(result).toEqual([]);
		});
	});

	describe('edge cases', () => {
		it('should return an empty list when all tip arrays are empty', () => {
			const messages: CompactConversationMessage[] = [
				makeAiMessage({
					learningTips: {
						grammarTips: [],
						phraseTips: [],
						vocabularyTips: []
					}
				})
			];

			const result = aggregateLearningTips(messages);

			expect(result).toEqual([]);
		});
	});
});
