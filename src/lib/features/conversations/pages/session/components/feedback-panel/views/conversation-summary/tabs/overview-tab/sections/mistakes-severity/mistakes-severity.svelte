<script lang="ts">
	import { Chart } from '@flowbite-svelte-plugins/chart';
	import type { ApexOptions } from 'apexcharts';
	import flatMap from 'lodash/flatMap';
	import { MISTAKE_SEVERITY_CHART_COLORS } from '$lib/features/conversations/pages/session/consts/mistake-severity-colors';
	import type {
		ConversationMessageMistake,
		ConversationMessageMistakeSeverity,
		ConversationUserMessageFeedbackDTO
	} from '$lib/types/conversation/domain/conversation-message-feedback';
	import { computeMessagesStats, type MistakeStats } from './utils/compute-message-stats';

	interface Props {
		feedbacks: ConversationUserMessageFeedbackDTO[];
	}

	const { feedbacks }: Props = $props();

	const allMistakes: ConversationMessageMistake[] = $derived(flatMap(feedbacks, (f) => f.mistakes));
	const mistakeStats: MistakeStats = $derived(computeMessagesStats(allMistakes));

	function getYAxisTooltip(value) {
		return `${value} mistake${value !== 1 ? 's' : ''}`;
	}

	const pieChartOptions: ApexOptions = $derived({
		chart: {
			type: 'pie',
			height: 300,
			toolbar: {
				show: false
			}
		},
		series: [Object.values(mistakeStats).map((s) => s.fraction)],
		labels: Object.values(mistakeStats).map((s) => s.label),
		colors: MISTAKE_SEVERITY_CHART_COLORS,
		dataLabels: {
			enabled: true,
			formatter: (val: number) => `${val.toFixed(1)}%`,
			style: {
				fontSize: '11px',
				fontWeight: 600,
				colors: ['#fff']
			},
			dropShadow: {
				enabled: true,
				opacity: 0.5,
				blur: 3
			}
		},
		legend: {
			show: false // Hide default legend, we'll use custom one
		},
		responsive: [
			{
				breakpoint: 768,
				options: {
					chart: {
						height: 250
					},
					dataLabels: {
						style: {
							fontSize: '10px'
						}
					}
				}
			}
		],
		tooltip: {
			y: {
				formatter: getYAxisTooltip
			}
		}
	});
</script>

<div class="space-y-4">
	<h3 class="heading-5">Mistake Severity</h3>
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<!-- Pie Chart -->
		<div class="p-4 rounded-lg">
			<Chart options={pieChartOptions} />
		</div>
		<!-- Detailed Legend -->
		<div class="p-4 rounded-lg flex flex-col justify-center">
			<div class="space-y-3">
				<!-- Minor -->
				<div class="flex items-center gap-3">
					<div
						class="w-4 h-4 rounded-full shrink-0"
						style="background-color: {MISTAKE_SEVERITY_CHART_COLORS[0]}"
					></div>
					<div class="flex-1">
						<div class="label">Minor (1)</div>
						<div class="caption">
							{severity1} mistake{severity1 !== 1 ? 's' : ''} • {severity1Percentage}%
						</div>
					</div>
				</div>
				<!-- Moderate -->
				<div class="flex items-center gap-3">
					<div
						class="w-4 h-4 rounded-full shrink-0"
						style="background-color: {MISTAKE_SEVERITY_CHART_COLORS[1]}"
					></div>
					<div class="flex-1">
						<div class="label">Moderate (2)</div>
						<div class="caption">
							{severity2} mistake{severity2 !== 1 ? 's' : ''} • {severity2Percentage}%
						</div>
					</div>
				</div>
				<!-- Critical -->
				<div class="flex items-center gap-3">
					<div
						class="w-4 h-4 rounded-full shrink-0"
						style="background-color: {MISTAKE_SEVERITY_CHART_COLORS[2]}"
					></div>
					<div class="flex-1">
						<div class="label">Critical (3)</div>
						<div class="caption">
							{severity3} mistake{severity3 !== 1 ? 's' : ''} • {severity3Percentage}%
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
