import type { ConversationMessageMistakeSeverity } from '$conversations/types';

export const MISTAKE_SEVERITY_CHART_COLORS_MAP: Record<ConversationMessageMistakeSeverity, string> =
	{
		MINOR: '#f87171',
		MODERATE: '#dc2626',
		CRITICAL: '#991b1b'
	};
