import type { ConversationSummaryDTO } from '$lib/types/conversation/domain/conversation';
import type { GetConversationsFilters } from '$lib/types/conversation/api/list-conversations';

export function mockSummariesMatchingFilters(
	items: readonly ConversationSummaryDTO[],
	filters: GetConversationsFilters
): ConversationSummaryDTO[] {
	return items.filter((c) => {
		if (filters.recencyBucket !== undefined && c.recencyBucket !== filters.recencyBucket) {
			return false;
		}
		if (filters.type !== undefined && c.type !== filters.type) {
			return false;
		}
		if (filters.search !== undefined && filters.search.trim() !== '') {
			const q = filters.search.trim().toLowerCase();
			const inTopic = c.topic.toLowerCase().includes(q);
			const inName = c.aiInterlocutorName.toLowerCase().includes(q);
			if (!inTopic && !inName) {
				return false;
			}
		}

		return true;
	});
}

/**
 * Dev-only extras for the conversations list UI. Flip to `false` to hide without deleting data.
 */
export const appendMockConversationSummariesInDev = true;

/**
 * Fixed UUIDs so list keys stay stable across HMR. One row per `RecencyBucket`, mixed types / avatars.
 */
export const MOCK_EXTRA_CONVERSATION_SUMMARIES: ConversationSummaryDTO[] = [
	{
		id: '00000000-0000-4000-8000-000000000001',
		topic: 'Coffee shop small talk',
		language: 'ENGLISH',
		proficiencyLevel: 'B1',
		type: 'SMALL_TALK',
		aiTone: 'FRIENDLY',
		aiInterlocutorName: 'Sofia',
		aiInterlocutorAvatarId: 'AVATAR_ALPHA',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		recencyBucket: 'TODAY'
	},
	{
		id: '00000000-0000-4000-8000-000000000002',
		topic: 'IELTS speaking part 2',
		language: 'ENGLISH',
		proficiencyLevel: 'B2',
		type: 'EXAM_PRACTICE',
		aiTone: 'FORMAL',
		aiInterlocutorName: 'Marcus Webb',
		aiInterlocutorAvatarId: 'AVATAR_BETA',
		createdAt: new Date(Date.now() - 86400000).toISOString(),
		updatedAt: new Date(Date.now() - 86400000).toISOString(),
		recencyBucket: 'YESTERDAY'
	},
	{
		id: '00000000-0000-4000-8000-000000000003',
		topic: 'Job interview at a tech company',
		language: 'ENGLISH',
		proficiencyLevel: 'C1',
		type: 'SCENARIO_ROLEPLAY',
		aiTone: 'NEUTRAL',
		aiInterlocutorName: 'Yuki Tanaka',
		aiInterlocutorAvatarId: 'AVATAR_GAMMA',
		createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
		updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
		recencyBucket: 'THIS_WEEK'
	},
	{
		id: '00000000-0000-4000-8000-000000000004',
		topic: 'Climate policy debate prep',
		language: 'ENGLISH',
		proficiencyLevel: 'C1',
		type: 'TOPIC_EXPLORATION',
		aiTone: 'CHALLENGING',
		aiInterlocutorName: 'Amara Okafor',
		aiInterlocutorAvatarId: 'AVATAR_DELTA',
		createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
		updatedAt: new Date(Date.now() - 12 * 86400000).toISOString(),
		recencyBucket: 'THIS_MONTH'
	},
	{
		id: '00000000-0000-4000-8000-000000000005',
		topic: 'Oxford-style motion: AI in schools',
		language: 'ENGLISH',
		proficiencyLevel: 'C2',
		type: 'OXFORD_DEBATE',
		aiTone: 'ENCOURAGING',
		aiInterlocutorName: 'Elena Vasquez',
		aiInterlocutorAvatarId: 'AVATAR_EPSILON',
		createdAt: new Date(Date.now() - 120 * 86400000).toISOString(),
		updatedAt: new Date(Date.now() - 120 * 86400000).toISOString(),
		recencyBucket: 'LATER'
	}
];
