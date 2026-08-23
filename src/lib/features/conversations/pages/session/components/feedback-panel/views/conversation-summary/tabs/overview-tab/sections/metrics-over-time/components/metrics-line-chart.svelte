<script lang="ts">
	import { defineChart, lineY, ruleY, text } from '@tanstack/charts';
	import { decorative } from '@tanstack/charts/mark/decorative';
	import { scaleLinear } from '@tanstack/charts/scales/linear';
	import { scalePoint } from '@tanstack/charts/scales/point';
	import { tooltip } from '@tanstack/charts/tooltip';
	import type { ChartPoint, ChartValue } from '@tanstack/charts';
	import {
		TanStackChart,
		CHART_MARGINS_AXIS,
		getChartInkMuted,
		getChartPrimaryLine
	} from '$lib/components/charts';
	import { cn } from '$lib/utils/cn';

	interface MetricRow {
		id: string;
		label: string;
		value: number;
		displayValue: string;
	}

	interface Props {
		data: (number | null)[];
		categories: string[];
		metricLabel: string;
		isScoreMetric?: boolean;
		average?: number | null;
		height?: number;
		xAxisLabel?: string;
		showValueLabels?: boolean;
	}

	const {
		data,
		categories,
		metricLabel,
		isScoreMetric = false,
		average = null,
		height = 220,
		xAxisLabel = 'Message',
		showValueLabels = true
	}: Props = $props();

	function formatValue(value: number): string {
		return isScoreMetric ? value.toFixed(1) : String(value);
	}

	const rows = $derived(
		data
			.map((value, index) =>
				value != null
					? {
							id: categories[index] ?? String(index),
							label: categories[index] ?? String(index + 1),
							value,
							displayValue: formatValue(value)
						}
					: null
			)
			.filter((row): row is MetricRow => row != null)
	);

	const averageRow = $derived(
		average != null
			? ([
					{
						id: 'avg',
						label: 'avg',
						value: average,
						displayValue: formatValue(average)
					}
				] satisfies MetricRow[])
			: []
	);

	const minHeightClass = $derived(
		height >= 200 ? 'min-h-[220px]' : height >= 160 ? 'min-h-[180px]' : 'min-h-[120px]'
	);

	const definition = $derived.by(() => {
		const marks = [
			lineY(rows, {
				id: 'metrics-line',
				x: 'label',
				y: 'value',
				points: false,
				stroke: getChartPrimaryLine(),
				strokeWidth: 2
			})
		];

		if (showValueLabels && rows.length > 0) {
			marks.push(
				// Decorative — labels sit above points; without this TanStack draws two focus rings.
				decorative(
					text(rows, {
						id: 'metrics-line-labels',
						x: 'label',
						y: 'value',
						text: 'displayValue',
						dy: -10,
						fontSize: 11,
						fontWeight: 600,
						fill: getChartPrimaryLine()
					})
				)
			);
		}

		if (average != null) {
			marks.push(
				ruleY(averageRow, {
					id: 'metrics-average',
					y: 'value',
					stroke: getChartInkMuted(),
					strokeWidth: 2,
					strokeDasharray: '4 4'
				})
			);
		}

		const yAxis = isScoreMetric
			? {
					// Configured instance — TanStack preserves [0, 10]; factories infer from data.
					scale: scaleLinear().domain([0, 10]),
					grid: true,
					axis: { label: metricLabel }
				}
			: {
					scale: scaleLinear,
					nice: true,
					grid: true,
					axis: { label: metricLabel }
				};

		return defineChart({
			marks,
			x: {
				scale: () => scalePoint<string>().padding(0.35),
				axis: { label: xAxisLabel }
			},
			y: yAxis,
			margin: showValueLabels ? { ...CHART_MARGINS_AXIS, top: 22 } : CHART_MARGINS_AXIS,
			// Permanent value labels replace hover chrome; tooltip only when labels are hidden.
			focusRing: !showValueLabels,
			tooltip: showValueLabels
				? false
				: {
						use: tooltip,
						format: (point: ChartPoint<unknown, ChartValue, ChartValue>) =>
							(point.datum as MetricRow).displayValue,
						placement: 'top',
						offset: 8,
						className:
							'rounded border border-line bg-surface px-2 py-1 text-xs font-semibold text-ink shadow-sm'
					}
		});
	});
</script>

<TanStackChart
	{definition}
	ariaLabel={metricLabel}
	{height}
	class={cn('min-h-0 w-full', minHeightClass)}
/>
