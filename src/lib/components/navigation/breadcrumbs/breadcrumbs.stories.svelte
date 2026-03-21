<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import CenterComponentDecorator from '$lib/storybook/decorators/center-component-decorator.svelte';

	const { Story } = defineMeta({
		title: 'Components/Navigation/Breadcrumbs',
		decorators: [() => CenterComponentDecorator as any]
	});
</script>

<script lang="ts">
	import { Breadcrumbs } from './index';
</script>

<Story name="TwoLevel">
	<div class="space-y-6">
		<p class="text-sm text-gray-600 dark:text-gray-400">
			Parent is clickable; current page is bold. (Check console for click.)
		</p>
		<Breadcrumbs
			items={[{ label: 'Summary', onClick: () => {} }, { label: 'Learning Tips' }]}
			class="mb-3"
		/>
		<Breadcrumbs items={[{ label: 'Summary', onClick: () => {} }, { label: 'Feedback' }]} />
	</div>
</Story>

<Story name="ThreeLevel">
	<div class="space-y-6">
		<Breadcrumbs
			items={[
				{ label: 'Dashboard', onClick: () => {} },
				{ label: 'Reports', onClick: () => {} },
				{ label: 'Export' }
			]}
		/>
	</div>
</Story>

<Story name="SingleSegment">
	<div class="space-y-6">
		<Breadcrumbs items={[{ label: 'Conversation Summary' }]} />
	</div>
</Story>
