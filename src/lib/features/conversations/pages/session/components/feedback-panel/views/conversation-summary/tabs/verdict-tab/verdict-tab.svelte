<script lang="ts">
	import flatMap from 'lodash/flatMap';
	import { ScrollableWrapper } from '$lib/components/utils/scrollable-wrapper';
	import { getMessagesContext } from '$conversations/pages/session/contexts/messages-context.svelte';
	import type { ConversationMessageMistake } from '$conversations/types';
	import { computeMessagesStats } from '../overview-tab/sections/mistakes-severity/utils/compute-message-stats';
	import VerdictScoreStrip from './sections/verdict-score-strip.svelte';
	import VerdictAiSummaryPlaceholder from './sections/verdict-ai-summary-placeholder.svelte';
	import VerdictTrend from './sections/verdict-trend.svelte';
	import VerdictSeverityBar from './sections/verdict-severity-bar.svelte';

	const messagesContext = getMessagesContext();
	const messages = $derived(messagesContext.messages);

	const userMessages = $derived(messages.filter((message) => message.sender === 'USER'));

	const analyses = $derived(
		userMessages.map((message) => message.analysis).filter((analysis) => analysis != null)
	);

	const allMistakes: ConversationMessageMistake[] = $derived(
		flatMap(analyses, (analysis) => analysis.mistakes)
	);

	const mistakeStats = $derived(computeMessagesStats(allMistakes));
	const totalMistakes = $derived(allMistakes.length);
</script>

<ScrollableWrapper wrapperClass="min-h-0" contentClass="flex min-h-full flex-col gap-6 px-0 mr-2">
	<div class="shrink-0">
		<VerdictScoreStrip {messages} />
	</div>

	<div class="shrink-0 space-y-6">
		<VerdictTrend {userMessages} />

		<VerdictSeverityBar {mistakeStats} {totalMistakes} />
	</div>

	<VerdictAiSummaryPlaceholder />
</ScrollableWrapper>
