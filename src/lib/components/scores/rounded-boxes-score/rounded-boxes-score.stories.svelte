<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import CenterComponentDecorator from '$lib/storybook/decorators/center-component-decorator.svelte';

	const { Story } = defineMeta({
		title: 'Components/Scores/RoundedBoxesScore',
		decorators: [() => CenterComponentDecorator as any]
	});
</script>

<script lang="ts">
	import RoundedBoxesScore from './rounded-boxes-score.svelte';

	const scores = Array.from({ length: 10 }, (_, i) => 10 - i);
</script>

<Story name="All Scores">
	<div class="max-w-md mx-auto space-y-2">
		{#each scores as score}
			<RoundedBoxesScore field="Example Field" {score} />
		{/each}
	</div>
</Story>
