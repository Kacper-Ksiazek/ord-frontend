<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import CenterComponentDecorator from '$lib/storybook/decorators/center-component-decorator.svelte';

	const { Story } = defineMeta({
		title: 'Actions/IconButton',
		decorators: [() => CenterComponentDecorator as any]
	});
</script>

<script lang="ts">
	import { IconButton } from './index';
	import { Search } from 'lucide-svelte';
</script>

<Story name="Default">
	<div>
		<h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Icon Button Variants</h3>
		<div class="grid grid-cols-5 gap-4 items-center">
			{#snippet tableHeader(text: string)}
				<div class="font-medium text-sm text-gray-600 dark:text-gray-400">{text}</div>
			{/snippet}

			{#snippet tableRowIndicator(text: string)}
				<div class="font-medium text-sm text-gray-700 dark:text-gray-300">{text}</div>
			{/snippet}

			<!-- Header Row -->
			<div></div>
			{@render tableHeader('Filled')}
			{@render tableHeader('Outlined')}
			{@render tableHeader('Filled Disabled')}
			{@render tableHeader('Outlined Disabled')}

			{@render tableRowIndicator('Primary')}
			<IconButton icon={Search} ariaLabel="Search" type="FILLED" variant="PRIMARY" />
			<IconButton icon={Search} ariaLabel="Search" type="OUTLINED" variant="PRIMARY" />
			<IconButton icon={Search} ariaLabel="Search" type="FILLED" variant="PRIMARY" disabled />
			<IconButton icon={Search} ariaLabel="Search" type="OUTLINED" variant="PRIMARY" disabled />

			{@render tableRowIndicator('Text')}
			<IconButton icon={Search} ariaLabel="Search" type="FILLED" variant="TEXT" />
			<IconButton icon={Search} ariaLabel="Search" type="OUTLINED" variant="TEXT" />
			<IconButton icon={Search} ariaLabel="Search" type="FILLED" variant="TEXT" disabled />
			<IconButton icon={Search} ariaLabel="Search" type="OUTLINED" variant="TEXT" disabled />

			{@render tableRowIndicator('Delete')}
			<IconButton icon={Search} ariaLabel="Search" type="FILLED" variant="DELETE" />
			<IconButton icon={Search} ariaLabel="Search" type="OUTLINED" variant="DELETE" />
			<IconButton icon={Search} ariaLabel="Search" type="FILLED" variant="DELETE" disabled />
			<IconButton icon={Search} ariaLabel="Search" type="OUTLINED" variant="DELETE" disabled />
		</div>
	</div>
</Story>
