import type { ConversationUserMessageAnalysisDTO } from '$lib/types/conversation/domain/conversation-message-analysis';
import type { MessageAnalysisCriteria } from '$lib/types/conversation/domain/message-analysis-criteria';

export interface AnalysisTextHighlightProps {
	id: string;
	disableHoverHighlight?: boolean;
	highlightType: MessageAnalysisCriteria;
	highlightedText: string;
	analysis: ConversationUserMessageAnalysisDTO;
	showIconsInHighlightedParts: boolean;
}
