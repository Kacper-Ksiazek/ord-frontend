<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'Components/PageContentContainer',
		tags: ['autodocs']
	});
</script>

<script lang="ts">
	import { PageContentContainer } from './index';
</script>

<Story name="Three Columns">
	<div class="min-h-screen bg-slate-100 dark:bg-slate-900 p-4">
		<PageContentContainer>
			<div class="p-4 bg-white dark:bg-gray-700 rounded-lg flex-1">
				<h3 class="font-semibold text-gray-900 dark:text-white mb-2">Column 1</h3>
				<p class="text-sm text-gray-600 dark:text-gray-400">First column content</p>
			</div>

			<div class="p-4 bg-white dark:bg-gray-700 rounded-lg flex-1">
				<h3 class="font-semibold text-gray-900 dark:text-white mb-2">Column 2</h3>
				<p class="text-sm text-gray-600 dark:text-gray-400">Second column content</p>
			</div>

			<div class="p-4 bg-white dark:bg-gray-700 rounded-lg flex-1">
				<h3 class="font-semibold text-gray-900 dark:text-white mb-2">Column 3</h3>
				<p class="text-sm text-gray-600 dark:text-gray-400">Third column content</p>
			</div>
		</PageContentContainer>
	</div>
</Story>
