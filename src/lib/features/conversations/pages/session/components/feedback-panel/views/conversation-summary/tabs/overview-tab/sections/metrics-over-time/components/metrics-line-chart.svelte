<script lang="ts">
	import { Chart } from '@flowbite-svelte-plugins/chart';
	import { themeStore } from '$lib/stores/theme.svelte';
	import type { ApexOptions } from 'apexcharts';

	interface Props {
		data: (number | null)[];
		categories: string[];
		metricLabel: string;
		isScoreMetric?: boolean;
		average?: number | null;
	}

	const { data, categories, metricLabel, isScoreMetric = false, average = null }: Props = $props();

	const isDark = $derived(themeStore.isDark);

	const avgLabelColor = $derived(isDark ? '#d1d5db' : '#4b5563');
	const avgLineColor = $derived(isDark ? '#9ca3af' : '#4b5563');

	const options: ApexOptions = $derived({
		series: [
			{
				name: metricLabel,
				data: data
			}
		],
		colors: ['#0ea5e9'], // primary-500
		chart: {
			type: 'line',
			height: 300,
			dropShadow: { enabled: false },
			toolbar: { show: false },
			zoom: { enabled: false }
		},
		stroke: {
			curve: 'smooth',
			width: 4
		},
		xaxis: {
			categories: categories,
			title: {
				text: 'Message',
				style: {
					color: '#6b7280',
					fontSize: '12px',
					fontWeight: 500
				}
			},
			labels: {
				style: {
					colors: '#6b7280'
				}
			}
		},
		yaxis: {
			min: isScoreMetric ? 0 : undefined,
			max: isScoreMetric ? 10 : undefined,
			tickAmount: isScoreMetric ? 10 : undefined, // 0–10 (10 intervals, 11 ticks)
			title: {
				text: metricLabel,
				style: {
					color: '#6b7280',
					fontSize: '12px',
					fontWeight: 500
				}
			},
			labels: {
				style: {
					colors: '#6b7280'
				}
			}
		},
		grid: {
			borderColor: '#e5e7eb',
			strokeDashArray: 4
		},
		markers: {
			size: 6,
			colors: ['#0284c7'], // primary-600
			strokeColors: '#0284c7', // primary-600
			hover: {
				size: 8
			}
		},
		tooltip: {
			enabled: false
		},
		dataLabels: {
			enabled: true,
			offsetY: -10,
			background: {
				enabled: true,
				borderColor: '#e5e7eb',
				borderRadius: 4
			},
			formatter: (val: string | number | number[]) => {
				if (val == null) return '';
				if (Array.isArray(val)) return val.length ? String(val[0]) : '';

				return String(val);
			},
			style: {
				fontSize: '14px',
				fontWeight: 500,
				colors: ['#6b7280']
			}
		},
		states: {
			hover: { filter: { type: 'none' } },
			active: { filter: { type: 'none' } }
		},
		annotations:
			average != null
				? {
						yaxis: [
							{
								y: average,
								strokeDashArray: 4,
								strokeWidth: 2,
								borderColor: avgLineColor,
								opacity: 1,
								label: {
									text: `Avg: ${average.toFixed(1)}`,
									position: 'right',
									offsetY: -10,
									style: {
										background: 'transparent',
										color: avgLabelColor,
										fontSize: '12px',
										fontWeight: 600
									}
								}
							}
						]
					}
				: undefined
	});
</script>

<Chart {options} />
