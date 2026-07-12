import { describe, it, expect } from 'vitest';
import type { CompactConversationMessage } from '$conversations/types';
import { aggregateAnalysis } from './aggregate-analysis';

function makeUserMessage(
	overrides: Partial<Extract<CompactConversationMessage, { sender: 'USER' }>> = {}
): CompactConversationMessage {
	return {
		sender: 'USER',
		content: 'Hello',
		analysis: null,
		createdAt: '2025-01-01T12:00:00.000Z',
		...overrides
	};
}

const baseAnalysis = {
	id: 'analysis-1',
	isSabotage: false,
	tutorComment: 'Good effort',
	grammar: 7,
	vocabulary: 8,
	naturalness: 7,
	coherenceWithContext: 8,
	messageId: 'msg-1'
};

describe('aggregateAnalysis', () => {
	describe('positive path', () => {
		it('should aggregate mistakes, strengths, and suggestions from user messages', () => {
			const messages: CompactConversationMessage[] = [
				makeUserMessage({
					analysis: {
						...baseAnalysis,
						mistakes: [
							{
								phrase: 'I goed',
								correctForm: 'I went',
								explanation: 'Use past tense',
								severity: 'MODERATE',
								errorType: 'GRAMMAR'
							}
						],
						strengths: [
							{
								phrase: 'Good vocabulary',
								explanation: 'Rich word choice',
								strengthType: 'VOCABULARY'
							}
						],
						suggestions: [
							{
								original: 'very good',
								alternatives: ['excellent', 'great'],
								explanation: 'Try a stronger adjective',
								suggestionType: 'VOCABULARY'
							}
						]
					}
				})
			];

			const result = aggregateAnalysis(messages);

			expect(result).toHaveLength(3);
			expect(result.map((item) => item.type)).toEqual(['MISTAKES', 'STRENGTHS', 'SUGGESTIONS']);
			expect(result[0].phrase).toBe('I goed');
			expect(result[1].searchableText).toContain('rich word choice');
			expect(result[2].searchableText).toContain('excellent');
		});
	});

	describe('negative path', () => {
		it('should skip AI messages and user messages without analysis', () => {
			const messages: CompactConversationMessage[] = [
				{
					sender: 'AI',
					content: 'Hi',
					createdAt: '2025-01-01T12:00:00.000Z'
				},
				makeUserMessage({ analysis: null })
			];

			const result = aggregateAnalysis(messages);

			expect(result).toEqual([]);
		});
	});

	describe('edge cases', () => {
		it('should return an empty list when analysis sections are missing', () => {
			const messages: CompactConversationMessage[] = [
				makeUserMessage({
					analysis: {
						...baseAnalysis,
						mistakes: [],
						strengths: [],
						suggestions: []
					}
				})
			];

			const result = aggregateAnalysis(messages);

			expect(result).toEqual([]);
		});
	});
});
