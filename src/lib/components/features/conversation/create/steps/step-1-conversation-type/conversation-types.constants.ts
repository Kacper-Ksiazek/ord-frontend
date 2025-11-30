import type { ConversationType } from '$lib/types/conversation/domain/conversation';

export const conversationTypes: {
	type: ConversationType;
	label: string;
	description: string;
}[] = [
	{
		type: 'SMALL_TALK',
		label: 'Small Talk',
		description: 'Practice casual and everyday conversations to build fluency and confidence.'
	},
	{
		type: 'SCENARIO_ROLEPLAY',
		label: 'Scenario Roleplay',
		description: 'Act out realistic scenarios and roles for immersive language learning.'
	},
	{
		type: 'EXAM_PRACTICE',
		label: 'Exam Practice',
		description: 'Prepare for language exams with focused practice on common test situations.'
	},
	{
		type: 'TOPIC_EXPLORATION',
		label: 'Topic Exploration',
		description:
			'Engage in in-depth discussions about various topics to expand your vocabulary and comprehension.'
	},
	{
		type: 'OXFORD_DEBATE',
		label: 'Oxford Debate',
		description:
			'Participate in a structured debate format to develop persuasive and critical thinking skills.'
	}
] as const;
