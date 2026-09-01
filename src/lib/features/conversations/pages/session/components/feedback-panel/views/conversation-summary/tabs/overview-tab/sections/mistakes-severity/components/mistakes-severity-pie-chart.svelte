<script lang="ts">
	import { defineChart } from '@tanstack/charts';
	import { pie, polar, radialArc } from '@tanstack/charts/polar';
	import { scaleOrdinal } from '@tanstack/charts/scales/ordinal';
	import { TanStackChart } from '$lib/components/charts';
	import { type MistakeStats } from '../utils/compute-message-stats';

	interface Props {
		mistakeStats: MistakeStats;
	}

	const { mistakeStats }: Props = $props();

	const sliceRows = $derived(
		Object.entries(mistakeStats).map(([id, stat]) => ({
			id,
			label: stat.label,
			value: stat.count,
			color: stat.color
		}))
	);

	const totalCount = $derived(sliceRows.reduce((sum, row) => sum + row.value, 0));

	const slices = $derived(totalCount > 0 ? pie(sliceRows, { value: 'value' }) : []);

	const definition = $derived(
		defineChart({
			marks: [
				polar({
					inset: 4,
					radiusRatio: 0.9,
					marks: [
						radialArc(slices, {
							innerRadius: ({ radius }) => radius * 0.58,
							cornerRadius: 3,
							color: 'id',
							key: 'id'
						})
					]
				})
			],
			color: {
				domain: sliceRows.map((row) => row.id),
				scale: () =>
					scaleOrdinal<string, string>()
						.domain(sliceRows.map((row) => row.id))
						.range(sliceRows.map((row) => row.color))
			}
		})
	);
</script>

<TanStackChart
	{definition}
	ariaLabel="Mistake severity distribution"
	height={220}
	class="min-h-[220px]"
/>
