import type { ConversationUserMessageAnalysisDTO } from '$conversations/types';
import type { MessageAnalysisCriteria } from '$conversations/types';

export interface AnalysisTextHighlightProps {
	id: string;
	disableHoverHighlight?: boolean;
	highlightType: MessageAnalysisCriteria;
	highlightedText: string;
	analysis: ConversationUserMessageAnalysisDTO;
	showIconsInHighlightedParts: boolean;
}
