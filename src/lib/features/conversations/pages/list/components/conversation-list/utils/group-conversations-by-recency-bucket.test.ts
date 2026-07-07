import { describe, it, expect } from 'vitest';
import type { ConversationSummaryDTO } from '$conversations/types';
import { groupConversationsByRecencyBucket } from './group-conversations-by-recency-bucket';

function makeConversationSummary(
	overrides: Partial<ConversationSummaryDTO> & Pick<ConversationSummaryDTO, 'id' | 'recencyBucket'>
): ConversationSummaryDTO {
	return {
		topic: 'topic',
		language: 'ENGLISH',
		proficiencyLevel: 'B1',
		type: 'SMALL_TALK',
		aiTone: 'FRIENDLY',
		aiInterlocutorName: 'Name',
		aiInterlocutorAvatarId: 'AVATAR_DEFAULT',
		createdAt: '2025-01-01T00:00:00.000Z',
		updatedAt: '2025-01-01T00:00:00.000Z',
		...overrides
	};
}

describe('groupConversationsByRecencyBucket', () => {
	describe('positive path', () => {
		it('should return a single section with items when all conversations share one bucket', () => {
			const items = [
				makeConversationSummary({ id: 'a', recencyBucket: 'TODAY' }),
				makeConversationSummary({ id: 'b', recencyBucket: 'TODAY' })
			];

			const result = groupConversationsByRecencyBucket(items);

			expect(result).toEqual([
				{
					section: 'TODAY',
					items
				}
			]);
		});

		it('should order sections by fixed recency order regardless of input order', () => {
			const later = makeConversationSummary({ id: '1', recencyBucket: 'LATER' });
			const today = makeConversationSummary({ id: '2', recencyBucket: 'TODAY' });
			const thisWeek = makeConversationSummary({ id: '3', recencyBucket: 'THIS_WEEK' });

			const result = groupConversationsByRecencyBucket([later, today, thisWeek]);

			expect(result.map((g) => g.section)).toEqual(['TODAY', 'THIS_WEEK', 'LATER']);
			expect(result[0].items).toEqual([today]);
			expect(result[1].items).toEqual([thisWeek]);
			expect(result[2].items).toEqual([later]);
		});

		it('should preserve relative order of items within the same bucket', () => {
			const first = makeConversationSummary({ id: 'first', recencyBucket: 'YESTERDAY' });
			const second = makeConversationSummary({ id: 'second', recencyBucket: 'YESTERDAY' });

			const result = groupConversationsByRecencyBucket([first, second]);

			expect(result[0].items).toEqual([first, second]);
		});
	});

	describe('negative path', () => {
		it('should throw when an item has an invalid recency bucket at runtime', () => {
			const invalid = {
				...makeConversationSummary({ id: 'x', recencyBucket: 'TODAY' }),
				recencyBucket: 'INVALID'
			} as unknown as ConversationSummaryDTO;

			expect(() => groupConversationsByRecencyBucket([invalid])).toThrow();
		});
	});

	describe('edge cases', () => {
		it('should return an empty array when there are no conversations', () => {
			const result = groupConversationsByRecencyBucket([]);

			expect(result).toEqual([]);
		});

		it('should omit buckets that have no conversations', () => {
			const onlyMonth = makeConversationSummary({ id: 'm', recencyBucket: 'THIS_MONTH' });

			const result = groupConversationsByRecencyBucket([onlyMonth]);

			expect(result).toEqual([{ section: 'THIS_MONTH', items: [onlyMonth] }]);
		});
	});
});
