import { describe, expect, it } from 'vitest';
import {
	CONVERSATION_AVATAR_FALLBACK_ID,
	resolveConversationAvatarId
} from './resolve-conversation-avatar-id';

describe('resolveConversationAvatarId', () => {
	it('maps AVATAR_DEFAULT to the fallback asset id', () => {
		expect(resolveConversationAvatarId('AVATAR_DEFAULT')).toBe(CONVERSATION_AVATAR_FALLBACK_ID);
	});

	it('passes through concrete avatar ids', () => {
		expect(resolveConversationAvatarId('AVATAR_EPSILON')).toBe('AVATAR_EPSILON');
	});
});
