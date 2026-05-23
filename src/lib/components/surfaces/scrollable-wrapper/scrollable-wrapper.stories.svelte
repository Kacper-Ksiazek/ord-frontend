<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import CenterComponentDecorator from '$lib/storybook/decorators/center-component-decorator.svelte';

	const { Story } = defineMeta({
		title: 'Surfaces/ScrollableWrapper',
		decorators: [() => CenterComponentDecorator as any],
		tags: ['autodocs']
	});
</script>

<script lang="ts">
	import { ScrollableWrapper } from './index';
</script>

<Story name="Default">
	<!-- Same contract as app: bounded column — flex + min-h-0 so flex-1 child can shrink and scroll. -->
	<div
		class="flex h-[320px] w-full max-w-md flex-col overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-2 min-h-0 dark:border-gray-700 dark:bg-gray-900"
	>
		<ScrollableWrapper wrapperClass="min-h-0 flex-1 px-3 py-4" contentClass="gap-4">
			{#each Array.from({ length: 24 }, (_, i) => i) as i (i)}
				<div
					class="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
				>
					Scrollable block {i + 1} — content grows vertically so the fade mask and scrollbar activate.
				</div>
			{/each}
		</ScrollableWrapper>
	</div>
</Story>

<Story name="TightPadding">
	<div
		class="flex h-[200px] w-full max-w-sm flex-col overflow-hidden rounded-lg border border-dashed border-gray-300 min-h-0 dark:border-gray-600"
	>
		<ScrollableWrapper wrapperClass="min-h-0 flex-1 px-2 py-1" contentClass="gap-2">
			{#each Array.from({ length: 16 }, (_, i) => i) as i (i)}
				<p class="text-xs text-gray-600 dark:text-gray-400">Row {i + 1}</p>
			{/each}
		</ScrollableWrapper>
	</div>
</Story>
