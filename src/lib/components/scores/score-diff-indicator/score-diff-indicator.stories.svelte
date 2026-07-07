<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import CenterComponentDecorator from '$lib/storybook/decorators/center-component-decorator.svelte';

	const { Story } = defineMeta({
		title: 'Scores/ScoreDiffIndicator',
		decorators: [() => CenterComponentDecorator as any],
		tags: ['autodocs']
	});
</script>

<script lang="ts">
	import { ScoreDiffIndicator } from './index';

	const cases = [
		{ label: 'Positive (+1.2)', currentScore: 8.7, averageScore: 7.5 },
		{ label: 'Negative (-2.3)', currentScore: 5.2, averageScore: 7.5 },
		{ label: 'Equal (renders nothing)', currentScore: 7.5, averageScore: 7.5 },
		{ label: 'Null current (renders nothing)', currentScore: null, averageScore: 7.5 }
	];
</script>

<Story name="All cases">
	<div class="p-8 bg-white dark:bg-gray-900">
		<div class="flex flex-col gap-4">
			{#each cases as c (c.label)}
				<div class="flex items-center gap-3">
					<span class="text-sm text-gray-600 dark:text-gray-400 w-64">{c.label}</span>
					<ScoreDiffIndicator currentScore={c.currentScore} averageScore={c.averageScore} />
				</div>
			{/each}
		</div>
	</div>
</Story>
