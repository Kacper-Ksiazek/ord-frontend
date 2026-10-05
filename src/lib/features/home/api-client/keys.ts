export const homeKeys = {
	all: ['home'] as const,
	summary: () => [...homeKeys.all, 'summary'] as const,
	activity: () => [...homeKeys.all, 'activity'] as const
};
