<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import CenterComponentDecorator from '$lib/storybook/decorators/center-component-decorator.svelte';

	const { Story } = defineMeta({
		title: 'Conversations/LineChartCard',
		decorators: [() => CenterComponentDecorator as any]
	});
</script>

<script lang="ts">
	import { LineChartCard } from './index';
	import type { LineChartDataPoint } from './line-chart-card.types';

	const upward: LineChartDataPoint[] = [
		{ label: 'Mon', value: 2 },
		{ label: 'Tue', value: 4 },
		{ label: 'Wed', value: 3 },
		{ label: 'Thu', value: 7 },
		{ label: 'Fri', value: 9 }
	];

	const flat: LineChartDataPoint[] = [
		{ label: 'a', value: 5 },
		{ label: 'b', value: 5 },
		{ label: 'c', value: 5 },
		{ label: 'd', value: 5 }
	];

	const noisy: LineChartDataPoint[] = [
		{ label: 'a', value: 3 },
		{ label: 'b', value: 8 },
		{ label: 'c', value: 2 },
		{ label: 'd', value: 6 },
		{ label: 'e', value: 4 },
		{ label: 'f', value: 9 }
	];

	const single: LineChartDataPoint[] = [{ label: 'only', value: 42 }];

	let activeCard = $state<string | null>(null);
</script>

<Story name="Default">
	<div>
		<h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Default (primary)</h3>
		<LineChartCard title="Total" value={42} data={upward} class="min-w-[260px]" />
	</div>
</Story>

<Story name="Variants grid">
	<div>
		<h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
			Variants with sample series
		</h3>
		<div class="grid grid-cols-[repeat(3,260px)] gap-4">
			<LineChartCard title="Neutral" value={75} variant="neutral" data={upward} />
			<LineChartCard title="Primary" value={75} variant="primary" data={upward} />
			<LineChartCard title="Blue" value={75} variant="blue" data={noisy} />
			<LineChartCard title="Green" value={50} variant="green" data={flat} />
			<LineChartCard title="Red" value={25} variant="red" data={noisy} />
			<LineChartCard title="Purple" value={88} variant="purple" data={upward} />
			<LineChartCard title="Inactive" value={0} variant="inactive" data={upward} />
		</div>
	</div>
</Story>

<Story name="Edge cases">
	<div>
		<h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
			Empty, single point, flat
		</h3>
		<div class="grid grid-cols-[repeat(3,260px)] gap-4">
			<LineChartCard title="Empty data" value="—" variant="neutral" data={[]} />
			<LineChartCard title="Single" value={42} variant="blue" data={single} />
			<LineChartCard title="Flat" value={5} variant="green" data={flat} />
		</div>
	</div>
</Story>

<Story name="Active toggle">
	<div>
		<h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
			Click cards to toggle active (chart tint follows)
		</h3>
		<p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
			Active: <strong>{activeCard ?? 'none'}</strong>
		</p>
		<div class="grid grid-cols-[repeat(3,260px)] gap-4">
			<LineChartCard
				title="Neutral"
				value={100}
				variant="neutral"
				data={upward}
				isActive={activeCard === 'neutral'}
				onclick={() => (activeCard = activeCard === 'neutral' ? null : 'neutral')}
			/>
			<LineChartCard
				title="Primary"
				value={100}
				variant="primary"
				data={upward}
				isActive={activeCard === 'primary'}
				onclick={() => (activeCard = activeCard === 'primary' ? null : 'primary')}
			/>
			<LineChartCard
				title="Blue"
				value={75}
				variant="blue"
				data={noisy}
				isActive={activeCard === 'blue'}
				onclick={() => (activeCard = activeCard === 'blue' ? null : 'blue')}
			/>
		</div>
	</div>
</Story>

<Story name="Chart aria label">
	<div>
		<h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
			Decorative vs described chart
		</h3>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
			<LineChartCard
				title="Messages"
				value={120}
				variant="neutral"
				data={upward}
				chartAriaLabel="Message volume over the last five weekdays"
			/>
			<LineChartCard title="No aria" value={120} variant="neutral" data={upward} />
		</div>
	</div>
</Story>
