<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'Utils/PageContentContainer',
		tags: ['autodocs']
	});
</script>

<script lang="ts">
	import { PageContentContainer } from './index';
</script>

<Story name="Three Columns">
	<div class="min-h-screen bg-accent-soft p-4">
		<PageContentContainer>
			<div class="p-4 bg-surface rounded-lg flex-1">
				<h3 class="font-semibold text-ink mb-2">Column 1</h3>
				<p class="text-sm text-ink-muted">First column content</p>
			</div>

			<div class="p-4 bg-surface rounded-lg flex-1">
				<h3 class="font-semibold text-ink mb-2">Column 2</h3>
				<p class="text-sm text-ink-muted">Second column content</p>
			</div>

			<div class="p-4 bg-surface rounded-lg flex-1">
				<h3 class="font-semibold text-ink mb-2">Column 3</h3>
				<p class="text-sm text-ink-muted">Third column content</p>
			</div>
		</PageContentContainer>
	</div>
</Story>
