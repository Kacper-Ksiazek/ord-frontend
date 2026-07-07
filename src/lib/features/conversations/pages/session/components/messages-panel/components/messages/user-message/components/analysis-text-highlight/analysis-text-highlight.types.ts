import type { ConversationUserMessageAnalysisDTO } from '$conversations/types/domain/conversation-message-analysis';
import type { MessageAnalysisCriteria } from '$conversations/types/domain/message-analysis-criteria';

export interface AnalysisTextHighlightProps {
	id: string;
	disableHoverHighlight?: boolean;
	highlightType: MessageAnalysisCriteria;
	highlightedText: string;
	analysis: ConversationUserMessageAnalysisDTO;
	showIconsInHighlightedParts: boolean;
}
