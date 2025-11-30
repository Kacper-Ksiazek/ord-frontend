import type { ConversationAITone } from '$lib/types/conversation/domain/conversation';

export const conversationTones: {
	tone: ConversationAITone;
	label: string;
	description: string;
}[] = [
	{
		tone: 'FRIENDLY',
		label: 'Friendly',
		description:
			'Be conversational, warm, and approachable. Use casual language, show genuine interest, and create a comfortable atmosphere like chatting with a friend.'
	},
	{
		tone: 'FORMAL',
		label: 'Formal',
		description:
			'Maintain professional boundaries and proper etiquette. Use correct grammar, structured sentences, and polite language appropriate for business or academic settings.'
	},
	{
		tone: 'HUMOROUS',
		label: 'Humorous',
		description:
			'Incorporate lighthearted humor, playful language, and witty remarks when appropriate. Keep the conversation fun and entertaining while staying on topic.'
	},
	{
		tone: 'NEUTRAL',
		label: 'Neutral',
		description:
			'Maintain a balanced, objective tone without being overly casual or formal. Be clear, direct, and matter-of-fact in your responses.'
	},
	{
		tone: 'ENCOURAGING',
		label: 'Encouraging',
		description:
			"Be supportive, positive, and motivating. Celebrate progress, provide gentle corrections, and boost the learner's confidence throughout the conversation."
	},
	{
		tone: 'CHALLENGING',
		label: 'Challenging',
		description:
			'Push the learner to think critically and express complex ideas. Ask thought-provoking questions and encourage deeper engagement with the topic.'
	}
] as const;
