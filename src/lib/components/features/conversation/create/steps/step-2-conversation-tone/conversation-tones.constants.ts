import type { ConversationAITone } from '$lib/types/conversation/domain/conversation';

export const conversationTones: {
	tone: ConversationAITone;
	label: string;
	description: string;
}[] = [
	{
		tone: 'FRIENDLY',
		label: 'Friendly',
		description: 'The AI will communicate in a warm, casual manner, like chatting with a friend.'
	},
	{
		tone: 'FORMAL',
		label: 'Formal',
		description:
			'The AI will use professional language and proper etiquette, suitable for business or academic contexts.'
	},
	{
		tone: 'HUMOROUS',
		label: 'Humorous',
		description: 'The AI will incorporate humor and keep the conversation light and entertaining.'
	},
	{
		tone: 'NEUTRAL',
		label: 'Neutral',
		description: 'The AI will maintain a balanced, objective tone without being too casual or formal.'
	},
	{
		tone: 'ENCOURAGING',
		label: 'Encouraging',
		description:
			'The AI will be supportive and positive, celebrating your progress and building your confidence.'
	},
	{
		tone: 'CHALLENGING',
		label: 'Challenging',
		description:
			'The AI will push you to think critically and express complex ideas with deeper questions.'
	}
] as const;
