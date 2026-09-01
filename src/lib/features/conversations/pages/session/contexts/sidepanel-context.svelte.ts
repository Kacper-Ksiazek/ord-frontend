import { createContext } from 'svelte';

export type SummaryTab = 'verdict' | 'analysis' | 'learning-tips';

export type SidepanelContext = {
	isOpened: boolean;
	summaryTab: SummaryTab;
	/** Global message index in `messagesContext.messages` for browse-tab filtering. */
	filterMessageOrder: number | null;
	/** One-shot scroll target for the messages panel. */
	scrollToMessageIndex: number | null;
};

export const [getSidepanelContext, setSidepanelContext] = createContext<SidepanelContext>();

export function createSidepanelContext() {
	const context: SidepanelContext = $state({
		isOpened: false,
		summaryTab: 'verdict',
		filterMessageOrder: null,
		scrollToMessageIndex: null
	});

	setSidepanelContext(context);
}

export function openSummary(
	context: SidepanelContext,
	tab: SummaryTab = 'verdict',
	filterMessageOrder: number | null = null
) {
	context.isOpened = true;
	context.summaryTab = tab;
	context.filterMessageOrder = filterMessageOrder;
}

export function openSummaryForMessage(
	context: SidepanelContext,
	tab: 'analysis' | 'learning-tips',
	messageOrder: number
) {
	openSummary(context, tab, messageOrder);
}

export function requestScrollToMessage(context: SidepanelContext, messageIndex: number) {
	context.scrollToMessageIndex = messageIndex;
}

export function clearSummaryMessageFilter(context: SidepanelContext) {
	context.filterMessageOrder = null;
}
