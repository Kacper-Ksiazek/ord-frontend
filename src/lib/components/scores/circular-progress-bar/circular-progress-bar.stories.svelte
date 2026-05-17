<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'Components/Scores/CircularProgressBar',
		tags: ['autodocs']
	});
</script>

<script lang="ts">
	import { CircularProgressBar } from './index';

	const scores = Array.from({ length: 10 }, (_, i) => i + 1);
</script>

<Story name="All Ratings">
	<div class="p-8 bg-white dark:bg-gray-900 min-h-screen">
		<div class="max-w-4xl mx-auto">
			<h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Score Ratings (1-10)</h2>
			<div class="grid grid-cols-5 gap-8">
				{#each scores as score (score)}
					<CircularProgressBar label="Score {score}" {score} />
				{/each}
			</div>
		</div>
	</div>
</Story>

<Story name="With Null Score">
	<div class="p-8 bg-white dark:bg-gray-900 min-h-screen">
		<div class="max-w-4xl mx-auto">
			<h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Null Score Example</h2>
			<div class="flex justify-center">
				<CircularProgressBar label="No Data" score={null} />
			</div>
		</div>
	</div>
</Story>

<Story name="Custom Sizes">
	<div class="p-8 bg-white dark:bg-gray-900 min-h-screen">
		<div class="max-w-4xl mx-auto">
			<h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Different Sizes</h2>
			<div class="flex items-end justify-center gap-8">
				<CircularProgressBar label="Small" score={7.5} size={80} strokeWidth={6} />
				<CircularProgressBar label="Medium" score={7.5} size={120} strokeWidth={8} />
				<CircularProgressBar label="Large" score={7.5} size={160} strokeWidth={10} />
			</div>
		</div>
	</div>
</Story>
