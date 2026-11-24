<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import CenterComponentDecorator from '$lib/storybook/decorators/center-component-decorator.svelte';

	const { Story } = defineMeta({
		title: 'Scores/ScoreBox',
		decorators: [() => CenterComponentDecorator as any],
		tags: ['autodocs']
	});
</script>

<script lang="ts">
	import { ScoreBox } from './index';

	const scores = [null, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
</script>

<Story name="All Scores">
	<div class="p-8 bg-surface min-h-screen">
		<div class="max-w-4xl mx-auto">
			<h2 class="text-2xl font-bold mb-6 text-ink">Score Box Colors (0-10)</h2>
			<div class="flex flex-wrap items-center gap-4">
				{#each scores as score (score)}
					<div class="flex flex-col items-center gap-2">
						<ScoreBox {score} />
						<span class="text-xs text-ink-muted">{score ?? 'null'}</span>
					</div>
				{/each}
			</div>
		</div>
	</div>
</Story>
