import type { ConversationDTO } from '../domain/entities';

/**
 * Mock conversation data for demonstration purposes
 * These are realistic examples covering different types, languages, and proficiency levels
 */

export const mockConversations: ConversationDTO[] = [
	{
		id: '550e8400-e29b-41d4-a716-446655440001',
		topic: 'Weekend plans',
		language: 'ENGLISH',
		proficiencyLevel: 'B1',
		type: 'SMALL_TALK',
		aiTone: 'FRIENDLY',
		aiInterlocutorName: 'Sarah',
		aiInterlocutorAvatarId: 'AVATAR_ALPHA',
		messages: [
			{
				id: 'msg-001-001',
				messageOrder: 0,
				sender: 'AI',
				content: 'Hey! How was your weekend? Did you do anything fun?',
				createdAt: '2024-11-20T10:00:00Z'
			},
			{
				id: 'msg-001-002',
				messageOrder: 1,
				sender: 'USER',
				content: 'It was really nice! I went to the beach with my friends and we had a picnic.',
				feedback: {
					id: 'feedback-001',
					grammar: 9,
					vocabulary: 8,
					answerLength: 9,
					naturalness: 8,
					coherenceWithContext: 9,
					registerAppropriate: true,
					mistakes: [],
					strengthsIdentified: ['Clear and descriptive response', 'Good use of past tense'],
					vocabularyEnrichment: [],
					alternativeExpressions: [],
					messageId: 'msg-001-002'
				},
				createdAt: '2024-11-20T10:05:00Z'
			},
			{
				id: 'msg-001-003',
				messageOrder: 2,
				sender: 'AI',
				content: 'That sounds amazing! Did you try any new foods or activities?',
				createdAt: '2024-11-20T10:10:00Z'
			},
			{
				id: 'msg-001-004',
				messageOrder: 3,
				sender: 'USER',
				content: 'We tried making homemade ice cream. It was fun but a bit difficult.',
				createdAt: '2024-11-20T10:15:00Z'
			}
		],
		createdAt: '2024-11-20T10:00:00Z',
		updatedAt: '2024-11-20T10:15:00Z'
	},
	{
		id: '550e8400-e29b-41d4-a716-446655440002',
		topic: 'Job interview practice - Software Engineer',
		language: 'ENGLISH',
		proficiencyLevel: 'B2',
		type: 'SCENARIO_ROLEPLAY',
		aiTone: 'FORMAL',
		aiInterlocutorName: 'Mr. Johnson',
		aiInterlocutorAvatarId: 'AVATAR_BETA',
		messages: [
			{
				id: 'msg-002-001',
				messageOrder: 0,
				sender: 'AI',
				content:
					'Good morning. Thank you for coming in today. Could you tell me about your experience with full-stack development?',
				createdAt: '2024-11-19T14:00:00Z'
			},
			{
				id: 'msg-002-002',
				messageOrder: 1,
				sender: 'USER',
				content:
					'I have more than five years of experience in developing web applications using React and Node.js.',
				createdAt: '2024-11-19T14:05:00Z'
			},
			{
				id: 'msg-002-003',
				messageOrder: 2,
				sender: 'AI',
				content: 'Interesting. Can you describe a challenging project you worked on?',
				createdAt: '2024-11-19T14:10:00Z'
			},
			{
				id: 'msg-002-004',
				messageOrder: 3,
				sender: 'USER',
				content:
					'One challenging project was building a real-time collaboration tool. We had to handle concurrent user edits and ensure data consistency across multiple clients.',
				createdAt: '2024-11-19T14:15:00Z'
			}
		],
		createdAt: '2024-11-19T14:00:00Z',
		updatedAt: '2024-11-19T14:15:00Z'
	},
	{
		id: '550e8400-e29b-41d4-a716-446655440003',
		topic: 'Restaurant conversation - Ordering food',
		language: 'SPANISH',
		proficiencyLevel: 'A2',
		type: 'SCENARIO_ROLEPLAY',
		aiTone: 'FRIENDLY',
		aiInterlocutorName: 'Carlos',
		aiInterlocutorAvatarId: 'AVATAR_GAMMA',
		messages: [
			{
				id: 'msg-003-001',
				messageOrder: 0,
				sender: 'AI',
				content: '¡Hola! Bienvenido a nuestro restaurante. ¿Qué desea ordenar hoy?',
				createdAt: '2024-11-18T19:00:00Z'
			},
			{
				id: 'msg-003-002',
				messageOrder: 1,
				sender: 'USER',
				content: 'Quisiera una paella de mariscos y una ensalada de tomate, por favor.',
				feedback: {
					id: 'feedback-003',
					grammar: 8,
					vocabulary: 7,
					answerLength: 7,
					naturalness: 8,
					coherenceWithContext: 9,
					registerAppropriate: true,
					mistakes: [],
					strengthsIdentified: ['Polite use of conditional tense', 'Clear order'],
					vocabularyEnrichment: [
						{
							original: 'quisiera',
							suggestion: 'me gustaría',
							explanation: 'Both are correct, but "me gustaría" is more commonly used in casual settings'
						}
					],
					alternativeExpressions: [],
					messageId: 'msg-003-002'
				},
				createdAt: '2024-11-18T19:05:00Z'
			},
			{
				id: 'msg-003-003',
				messageOrder: 2,
				sender: 'AI',
				content: '¿Excelente! ¿Desea alguna bebida?',
				createdAt: '2024-11-18T19:10:00Z'
			},
			{
				id: 'msg-003-004',
				messageOrder: 3,
				sender: 'USER',
				content: 'Un vaso de agua fría con limón, por favor.',
				createdAt: '2024-11-18T19:15:00Z'
			}
		],
		createdAt: '2024-11-18T19:00:00Z',
		updatedAt: '2024-11-18T19:15:00Z'
	},
	{
		id: '550e8400-e29b-41d4-a716-446655440004',
		topic: 'IELTS Writing Task - Academic debate on climate change',
		language: 'ENGLISH',
		proficiencyLevel: 'C1',
		type: 'EXAM_PRACTICE',
		aiTone: 'NEUTRAL',
		aiInterlocutorName: 'Dr. Smith',
		aiInterlocutorAvatarId: 'AVATAR_DELTA',
		messages: [
			{
				id: 'msg-004-001',
				messageOrder: 0,
				sender: 'AI',
				content:
					'Climate change is undoubtedly one of the most pressing issues of our time. What is your perspective on the primary causes?',
				createdAt: '2024-11-17T11:00:00Z'
			},
			{
				id: 'msg-004-002',
				messageOrder: 1,
				sender: 'USER',
				content:
					'While anthropogenic factors are undeniably significant contributors to climate change, we must also consider natural climatic cycles. However, the preponderance of evidence suggests that human activities, particularly fossil fuel combustion and deforestation, are the predominant drivers.',
				createdAt: '2024-11-17T11:05:00Z'
			},
			{
				id: 'msg-004-003',
				messageOrder: 2,
				sender: 'AI',
				content:
					'Well articulated. How do you reconcile the economic implications of transitioning to renewable energy with the environmental imperative?',
				createdAt: '2024-11-17T11:10:00Z'
			},
			{
				id: 'msg-004-004',
				messageOrder: 3,
				sender: 'USER',
				content:
					'The dichotomy is indeed complex. Nevertheless, long-term economic benefits of renewable energy infrastructure investment far outweigh the short-term costs of transition.',
				createdAt: '2024-11-17T11:15:00Z'
			}
		],
		createdAt: '2024-11-17T11:00:00Z',
		updatedAt: '2024-11-17T11:15:00Z'
	},
	{
		id: '550e8400-e29b-41d4-a716-446655440005',
		topic: 'Technology and its impact on society',
		language: 'FRENCH',
		proficiencyLevel: 'B1',
		type: 'TOPIC_EXPLORATION',
		aiTone: 'ENCOURAGING',
		aiInterlocutorName: 'Sophie',
		aiInterlocutorAvatarId: 'AVATAR_EPSILON',
		messages: [
			{
				id: 'msg-005-001',
				messageOrder: 0,
				sender: 'AI',
				content:
					'Bonjour! Parlons de la technologie. Pensez-vous que la technologie améliore notre vie quotidienne ou la rend plus compliquée?',
				createdAt: '2024-11-16T15:00:00Z'
			},
			{
				id: 'msg-005-002',
				messageOrder: 1,
				sender: 'USER',
				content:
					'Je pense que la technologie améliore beaucoup notre vie. Par exemple, les smartphones nous permettent de communiquer avec nos proches facilement.',
				createdAt: '2024-11-16T15:05:00Z'
			},
			{
				id: 'msg-005-003',
				messageOrder: 2,
				sender: 'AI',
				content:
					"C'est une excellente observation! Mais, avez-vous pensé aux aspects négatifs, comme la dépendance aux technologies?",
				createdAt: '2024-11-16T15:10:00Z'
			},
			{
				id: 'msg-005-004',
				messageOrder: 3,
				sender: 'USER',
				content:
					"Oui, c'est vrai. Les gens passent beaucoup de temps sur leurs téléphones et cela peut affecter leur santé mentale et leurs relations sociales.",
				createdAt: '2024-11-16T15:15:00Z'
			}
		],
		createdAt: '2024-11-16T15:00:00Z',
		updatedAt: '2024-11-16T15:15:00Z'
	},
	{
		id: '550e8400-e29b-41d4-a716-446655440006',
		topic: 'Should social media be regulated by governments?',
		language: 'ENGLISH',
		proficiencyLevel: 'B2',
		type: 'OXFORD_DEBATE',
		aiTone: 'CHALLENGING',
		aiInterlocutorName: 'Elizabeth',
		aiInterlocutorAvatarId: 'AVATAR_ZETA',
		additionalContext: 'Debate format: You must argue for government regulation of social media',
		messages: [
			{
				id: 'msg-006-001',
				messageOrder: 0,
				sender: 'AI',
				content:
					'Thank you for being here. We will be debating government regulation of social media. You support regulation. Please present your opening argument.',
				createdAt: '2024-11-15T16:00:00Z'
			},
			{
				id: 'msg-006-002',
				messageOrder: 1,
				sender: 'USER',
				content:
					'Government regulation is essential to protect citizens from misinformation, data breaches, and algorithmic manipulation. Without oversight, these platforms prioritize profit over user welfare.',
				createdAt: '2024-11-15T16:05:00Z'
			},
			{
				id: 'msg-006-003',
				messageOrder: 2,
				sender: 'AI',
				content:
					'Interesting argument, but how do you address concerns that heavy regulation could stifle innovation and freedom of expression?',
				createdAt: '2024-11-15T16:10:00Z'
			},
			{
				id: 'msg-006-004',
				messageOrder: 3,
				sender: 'USER',
				content:
					'Regulation and innovation are not mutually exclusive. We can establish clear data protection standards and content moderation requirements while maintaining space for technological advancement.',
				createdAt: '2024-11-15T16:15:00Z'
			}
		],
		createdAt: '2024-11-15T16:00:00Z',
		updatedAt: '2024-11-15T16:15:00Z'
	},
	{
		id: '550e8400-e29b-41d4-a716-446655440007',
		topic: 'Hotel check-in - Travel booking',
		language: 'GERMAN',
		proficiencyLevel: 'A1',
		type: 'SCENARIO_ROLEPLAY',
		aiTone: 'FORMAL',
		aiInterlocutorName: 'Klaus',
		aiInterlocutorAvatarId: 'AVATAR_ETA',
		messages: [
			{
				id: 'msg-007-001',
				messageOrder: 0,
				sender: 'AI',
				content: 'Guten Tag! Willkommen in unserem Hotel. Haben Sie eine Reservierung?',
				createdAt: '2024-11-14T08:00:00Z'
			},
			{
				id: 'msg-007-002',
				messageOrder: 1,
				sender: 'USER',
				content: 'Ja, ich bin John Smith. Ich habe ein Zimmer für drei Nächte reserviert.',
				createdAt: '2024-11-14T08:05:00Z'
			},
			{
				id: 'msg-007-003',
				messageOrder: 2,
				sender: 'AI',
				content: 'Ausgezeichnet! Können Sie mir bitte Ihren Pass zeigen?',
				createdAt: '2024-11-14T08:10:00Z'
			},
			{
				id: 'msg-007-004',
				messageOrder: 3,
				sender: 'USER',
				content: 'Natürlich. Hier ist mein Pass.',
				createdAt: '2024-11-14T08:15:00Z'
			}
		],
		createdAt: '2024-11-14T08:00:00Z',
		updatedAt: '2024-11-14T08:15:00Z'
	}
];

/**
 * Get a mock conversation by ID
 */
export function getMockConversationById(id: string): ConversationDTO | undefined {
	return mockConversations.find((conv) => conv.id === id);
}

/**
 * Generate a new mock conversation with empty messages
 */
export function createNewMockConversation(input: {
	topic: string;
	language: string;
	proficiencyLevel: string;
	type: string;
	aiTone: string;
	aiInterlocutorName?: string;
	aiInterlocutorAvatarId?: string;
	additionalContext?: string;
}): ConversationDTO {
	const id = `550e8400-e29b-41d4-a716-${Math.random().toString().substring(2, 12).padEnd(12, '0')}`;
	const now = new Date().toISOString();

	return {
		id,
		topic: input.topic,
		language: input.language as any,
		proficiencyLevel: input.proficiencyLevel as any,
		type: input.type as any,
		aiTone: input.aiTone as any,
		aiInterlocutorName: input.aiInterlocutorName,
		aiInterlocutorAvatarId: input.aiInterlocutorAvatarId as any,
		additionalContext: input.additionalContext,
		messages: [
			{
				id: `msg-${id.substring(0, 8)}-001`,
				messageOrder: 0,
				sender: 'AI',
				content: `Hello! I'm ready to start our conversation about "${input.topic}". How would you like to begin?`,
				createdAt: now
			}
		],
		createdAt: now,
		updatedAt: now
	};
}
