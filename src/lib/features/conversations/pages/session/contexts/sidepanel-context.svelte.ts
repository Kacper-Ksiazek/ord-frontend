import type { ConversationUserMessageAnalysisDTO } from '$lib/types/conversation/domain/conversation-message-analysis';
import { createContext } from 'svelte';

export type SidepanelContext = {
	isOpened: boolean;
	analysisPreview: ConversationUserMessageAnalysisDTO | null;
	learningTipsPreviewMessageOrder: number | null;
};

export const [getSidepanelContext, setSidepanelContext] = createContext<SidepanelContext>();

export function createSidepanelContext(latestAnalysis?: ConversationUserMessageAnalysisDTO | null) {
	const context: SidepanelContext = $state(
		latestAnalysis
			? {
					isOpened: true,
					analysisPreview: latestAnalysis,
					learningTipsPreviewMessageOrder: null
				}
			: {
					isOpened: false,
					analysisPreview: null,
					learningTipsPreviewMessageOrder: null
				}
	);

	setSidepanelContext(context);
}
