<script lang="ts">
	import flatMap from 'lodash/flatMap';
	import type {
		ConversationMessageMistake,
		ConversationUserMessageFeedbackDTO
	} from '$lib/types/conversation/domain/conversation-message-feedback';
	import { computeMessagesStats, type MistakeStats } from './utils/compute-message-stats';
	import { MistakesSeverityPieChart, MistakesSeverityChartLegend } from './components';

	interface Props {
		feedbacks: ConversationUserMessageFeedbackDTO[];
	}

	const { feedbacks }: Props = $props();

	const allMistakes: ConversationMessageMistake[] = $derived(flatMap(feedbacks, (f) => f.mistakes));
	const mistakeStats: MistakeStats = $derived(computeMessagesStats(allMistakes));
</script>

<div class="space-y-4">
	<h3 class="heading-5">Mistake Severity</h3>
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<MistakesSeverityPieChart {mistakeStats} />

		<MistakesSeverityChartLegend {mistakeStats} />
	</div>
</div>
