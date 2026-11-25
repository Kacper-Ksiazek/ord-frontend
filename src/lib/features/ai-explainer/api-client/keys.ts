export const explanationKeys = {
	all: ['ai-explainer', 'explanations'] as const,
	detail: (id: string) => [...explanationKeys.all, id] as const
};
