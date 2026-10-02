import type { ConversationSummaryDTO } from '$conversations/types';
import type { WordListItem } from '$words/types';

/** Temporary seed data until home API exposes recent items. */
export const HOME_RECENT_WORDS_SEED: WordListItem[] = [
	{
		id: 'seed-word-1',
		sourceWord: 'serendipity',
		translation: 'szczęśliwy traf',
		type: 'NOUN',
		definition:
			'A pleasant surprise when you find something valuable without looking for it — often used for happy accidents in discovery.',
		createdAt: '2026-09-28T14:22:00.000Z'
	},
	{
		id: 'seed-word-2',
		sourceWord: 'to nail it',
		translation: 'załatwić coś perfekcyjnie',
		type: 'IDIOM',
		definition:
			'To do something exactly right, especially under pressure — like acing a presentation or a tricky task.',
		createdAt: '2026-09-25T09:10:00.000Z'
	},
	{
		id: 'seed-word-3',
		sourceWord: 'meticulous',
		translation: 'skrupulatny',
		type: 'ADJECTIVE',
		definition:
			'Showing great attention to detail; careful and precise in work, planning, or everyday habits.',
		createdAt: '2026-09-20T18:45:00.000Z'
	}
];

export const HOME_RECENT_CONVERSATIONS_SEED: ConversationSummaryDTO[] = [
	{
		id: 'seed-conversation-1',
		topic: 'Ordering coffee at a busy café',
		language: 'ENGLISH',
		proficiencyLevel: 'B1',
		type: 'SMALL_TALK',
		aiTone: 'FRIENDLY',
		aiInterlocutorName: 'Emma',
		aiInterlocutorAvatarId: 'AVATAR_DEFAULT',
		recencyBucket: 'THIS_WEEK',
		createdAt: '2026-09-29T11:00:00.000Z',
		updatedAt: '2026-09-29T11:42:00.000Z'
	},
	{
		id: 'seed-conversation-2',
		topic: 'Explaining a delay to your manager',
		language: 'ENGLISH',
		proficiencyLevel: 'B2',
		type: 'SCENARIO_ROLEPLAY',
		aiTone: 'FORMAL',
		aiInterlocutorName: 'James',
		aiInterlocutorAvatarId: 'AVATAR_DEFAULT',
		recencyBucket: 'THIS_MONTH',
		createdAt: '2026-09-22T16:30:00.000Z',
		updatedAt: '2026-09-23T08:15:00.000Z'
	},
	{
		id: 'seed-conversation-3',
		topic: 'Weekend plans with a friend',
		language: 'ENGLISH',
		proficiencyLevel: 'A2',
		type: 'SMALL_TALK',
		aiTone: 'FRIENDLY',
		aiInterlocutorName: 'Lily',
		aiInterlocutorAvatarId: 'AVATAR_DEFAULT',
		recencyBucket: 'LATER',
		createdAt: '2026-09-10T19:00:00.000Z',
		updatedAt: '2026-09-10T19:55:00.000Z'
	}
];
