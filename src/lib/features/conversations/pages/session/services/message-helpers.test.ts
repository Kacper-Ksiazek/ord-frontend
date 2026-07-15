import { describe, expect, it } from 'vitest';
import type { CompactConversationMessage } from '$conversations/types';
import {
	findLatestAiMessageContent,
	findLatestAiMessageIndex,
	removeEmptyAiMessageAt
} from './message-helpers';

function ai(content: string): CompactConversationMessage {
	return { sender: 'AI', content, createdAt: '2026-01-01T00:00:00.000Z' };
}

function user(content: string): CompactConversationMessage {
	return {
		sender: 'USER',
		content,
		analysis: null,
		createdAt: '2026-01-01T00:00:00.000Z'
	};
}

describe('message-helpers', () => {
	describe('findLatestAiMessageIndex', () => {
		it('returns the last AI message before the given index', () => {
			const messages = [ai('hello'), user('hi'), ai('again')];

			expect(findLatestAiMessageIndex(messages, 2)).toBe(0);
			expect(findLatestAiMessageIndex(messages)).toBe(2);
		});

		it('returns -1 when no AI message exists', () => {
			expect(findLatestAiMessageIndex([user('only user')])).toBe(-1);
		});
	});

	describe('findLatestAiMessageContent', () => {
		it('returns content of the latest AI message before index', () => {
			const messages = [ai('first'), user('hi'), ai('second')];

			expect(findLatestAiMessageContent(messages, 2)).toBe('first');
			expect(findLatestAiMessageContent(messages)).toBe('second');
		});
	});

	describe('removeEmptyAiMessageAt', () => {
		it('removes an empty AI stub at the given index', () => {
			const messages = [user('hi'), ai('')];

			removeEmptyAiMessageAt(messages, 1);

			expect(messages).toHaveLength(1);
			expect(messages[0].sender).toBe('USER');
		});

		it('keeps non-empty AI messages', () => {
			const messages = [ai('kept')];

			removeEmptyAiMessageAt(messages, 0);

			expect(messages).toHaveLength(1);
			expect(messages[0].content).toBe('kept');
		});
	});
});
