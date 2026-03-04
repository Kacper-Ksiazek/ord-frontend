import { describe, it, expect } from 'vitest';
import { aggregateFeedback } from './aggregate-feedback';
import type { CompactConversationMessage } from '$lib/types/conversation/domain/conversation-message';
import type { ConversationUserMessageFeedbackDTO } from '$lib/types/conversation/domain/conversation-message-feedback';

const CREATED_AT = '2024-01-01T10:00:00.000Z';

const makeMistake = (overrides = {}) => ({
	phrase: 'I goed to store',
	correctForm: 'I went to the store',
	explanation: 'Irregular verb',
	severity: 'MINOR' as const,
	errorType: 'GRAMMAR' as const,
	...overrides
});

const makeStrength = (overrides = {}) => ({
	phrase: 'Nevertheless',
	explanation: 'Good use of connective',
	strengthType: 'VOCABULARY' as const,
	...overrides
});

const makeSuggestion = (overrides = {}) => ({
	original: 'very big',
	alternatives: ['enormous', 'huge'],
	explanation: 'More precise vocabulary',
	suggestionType: 'VOCABULARY' as const,
	...overrides
});

const makeBaseFeedback = (): ConversationUserMessageFeedbackDTO => ({
	id: 'feedback-id',
	messageId: 'message-id',
	tutorComment: 'Good effort',
	grammar: 80,
	vocabulary: 75,
	answerLength: 60,
	naturalness: 70,
	coherenceWithContext: 85,
	registerAppropriate: true,
	mistakes: [],
	strengths: [],
	suggestions: []
});

const makeUserMessage = (
	feedbackOverrides: Partial<ConversationUserMessageFeedbackDTO> | null = {}
): CompactConversationMessage => ({
	sender: 'USER',
	content: 'Hello',
	createdAt: CREATED_AT,
	feedback: feedbackOverrides === null ? null : { ...makeBaseFeedback(), ...feedbackOverrides }
});

const makeAiMessage = (): CompactConversationMessage => ({
	sender: 'AI',
	content: 'Hi there',
	createdAt: CREATED_AT
});

describe('aggregateFeedback', () => {
	describe('positive path', () => {
		it('should aggregate mistakes from user messages', () => {
			const mistake = makeMistake();
			const messages = [makeUserMessage({ mistakes: [mistake] })];

			const result = aggregateFeedback(messages);

			expect(result).toHaveLength(1);
			expect(result[0]).toEqual({
				type: 'MISTAKES',
				data: mistake,
				phrase: mistake.phrase,
				explanation: mistake.explanation,
				createdAt: new Date(CREATED_AT),
				searchableText: `${mistake.phrase} ${mistake.correctForm} ${mistake.explanation}`.toLowerCase()
			});
		});

		it('should aggregate strengths from user messages', () => {
			const strength = makeStrength();
			const messages = [makeUserMessage({ strengths: [strength] })];

			const result = aggregateFeedback(messages);

			expect(result).toHaveLength(1);
			expect(result[0]).toEqual({
				type: 'STRENGTHS',
				data: strength,
				phrase: strength.phrase,
				explanation: strength.explanation,
				createdAt: new Date(CREATED_AT),
				searchableText: `${strength.phrase} ${strength.explanation}`.toLowerCase()
			});
		});

		it('should aggregate suggestions from user messages', () => {
			const suggestion = makeSuggestion();
			const messages = [makeUserMessage({ suggestions: [suggestion] })];

			const result = aggregateFeedback(messages);

			expect(result).toHaveLength(1);
			expect(result[0]).toEqual({
				type: 'SUGGESTIONS',
				data: suggestion,
				phrase: suggestion.original,
				explanation: suggestion.explanation,
				createdAt: new Date(CREATED_AT),
				searchableText:
					`${suggestion.original} ${suggestion.alternatives.join(' ')} ${suggestion.explanation}`.toLowerCase()
			});
		});

		it('should aggregate all feedback types from a single message', () => {
			const mistake = makeMistake();
			const strength = makeStrength();
			const suggestion = makeSuggestion();
			const messages = [
				makeUserMessage({ mistakes: [mistake], strengths: [strength], suggestions: [suggestion] })
			];

			const result = aggregateFeedback(messages);

			expect(result).toHaveLength(3);
			expect(result.map((r) => r.type)).toEqual(['MISTAKES', 'STRENGTHS', 'SUGGESTIONS']);
		});

		it('should aggregate feedback from multiple user messages', () => {
			const messages = [
				makeUserMessage({ mistakes: [makeMistake({ phrase: 'a' })] }),
				makeUserMessage({ mistakes: [makeMistake({ phrase: 'b' })] })
			];

			const result = aggregateFeedback(messages);

			expect(result).toHaveLength(2);
		});

		it('should set createdAt from the message timestamp', () => {
			const createdAt = '2024-06-15T08:30:00.000Z';
			const messages = [{ ...makeUserMessage({ mistakes: [makeMistake()] }), createdAt }];

			const result = aggregateFeedback(messages);

			expect(result[0].createdAt).toEqual(new Date(createdAt));
		});

		it('should produce lowercase searchable text', () => {
			const mistake = makeMistake({ phrase: 'Hello', correctForm: 'World', explanation: 'Test' });
			const messages = [makeUserMessage({ mistakes: [mistake] })];

			const result = aggregateFeedback(messages);

			expect(result[0].searchableText).toBe('hello world test');
		});
	});

	describe('negative path', () => {
		it('should skip AI messages', () => {
			const messages = [makeAiMessage()];

			const result = aggregateFeedback(messages);

			expect(result).toHaveLength(0);
		});

		it('should skip user messages with null feedback', () => {
			const messages = [makeUserMessage(null)];

			const result = aggregateFeedback(messages);

			expect(result).toHaveLength(0);
		});

		it('should return empty array when all messages are AI messages', () => {
			const messages = [makeAiMessage(), makeAiMessage()];

			const result = aggregateFeedback(messages);

			expect(result).toEqual([]);
		});
	});

	describe('edge cases', () => {
		it('should return empty array for empty input', () => {
			const result = aggregateFeedback([]);

			expect(result).toEqual([]);
		});

		it('should handle feedback with undefined mistakes gracefully', () => {
			const messages = [makeUserMessage({ strengths: [makeStrength()] })];

			const result = aggregateFeedback(messages);

			expect(result).toHaveLength(1);
			expect(result[0].type).toBe('STRENGTHS');
		});

		it('should handle suggestion with multiple alternatives in searchable text', () => {
			const suggestion = makeSuggestion({ alternatives: ['big', 'large', 'vast'] });
			const messages = [makeUserMessage({ suggestions: [suggestion] })];

			const result = aggregateFeedback(messages);

			expect(result[0].searchableText).toContain('big large vast');
		});

		it('should handle mixed AI and user messages correctly', () => {
			const mistake = makeMistake();
			const messages = [makeAiMessage(), makeUserMessage({ mistakes: [mistake] }), makeAiMessage()];

			const result = aggregateFeedback(messages);

			expect(result).toHaveLength(1);
			expect(result[0].type).toBe('MISTAKES');
		});

		it('should return empty array for user message with empty feedback arrays', () => {
			const messages = [makeUserMessage()];

			const result = aggregateFeedback(messages);

			expect(result).toEqual([]);
		});
	});
});
