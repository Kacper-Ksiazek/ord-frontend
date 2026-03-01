<script lang="ts">
	import { Chart } from '@flowbite-svelte-plugins/chart';
	import type { ApexOptions } from 'apexcharts';
	import { type MistakeStats } from '../utils/compute-message-stats';

	interface Props {
		mistakeStats: MistakeStats;
	}

	const { mistakeStats }: Props = $props();

	const series = $derived(Object.values(mistakeStats).map((s) => s.fraction));
	const labels = $derived(Object.values(mistakeStats).map((s) => s.label));
	const colors = $derived(Object.values(mistakeStats).map((s) => s.color));

	const options: ApexOptions = $derived({
		series,
		labels,
		colors,
		chart: {
			type: 'pie',
			height: 300
		},
		dataLabels: {
			enabled: true,
			formatter: (val: number) => `${val.toFixed(1)}%`
		},
		legend: {
			show: false
		}
	});
</script>

<div class="p-4 rounded-lg">
	<Chart {options} />
</div>
