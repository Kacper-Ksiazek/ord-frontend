<script lang="ts">
	import { Chart } from '@flowbite-svelte-plugins/chart';
	import type { ApexOptions } from 'apexcharts';
	import { type MistakeStats } from '../utils/compute-message-stats';

	interface Props {
		mistakeStats: MistakeStats;
	}

	type StatsChartOptions = {
		series: number[];
		labels: string[];
		colors: string[];
	};

	const { mistakeStats }: Props = $props();

	const statsChartOptions: StatsChartOptions = $derived(
		Object.values(mistakeStats).reduce(
			(acc, s) => {
				acc.series.push(s.fraction);
				acc.labels.push(s.label);
				acc.colors.push(s.color);

				return acc;
			},
			{ series: [], labels: [], colors: [] } as StatsChartOptions
		)
	);

	function getYAxisTooltip(value: number): string {
		return `${value} mistake${value !== 1 ? 's' : ''}`;
	}

	const pieChartOptions: ApexOptions = $derived({
		...statsChartOptions,
		chart: {
			type: 'pie',
			height: 300,
			toolbar: {
				show: false
			}
		},
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

<div class="p-4 rounded-lg">
	<Chart options={pieChartOptions} />
</div>
