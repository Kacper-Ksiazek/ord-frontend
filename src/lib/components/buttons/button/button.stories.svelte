<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import CenterComponentDecorator from '$lib/storybook/decorators/center-component-decorator.svelte';

	const { Story } = defineMeta({
		title: 'Components/Buttons/Button',
		decorators: [() => CenterComponentDecorator as any]
	});
</script>

<script lang="ts">
	import { Button } from './index';
</script>

<Story name="Default">
	<div>
		<h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Button Variants</h3>
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
			<Button type="FILLED" variant="PRIMARY">Button</Button>
			<Button type="OUTLINED" variant="PRIMARY">Button</Button>
			<Button type="FILLED" variant="PRIMARY" disabled>Button</Button>
			<Button type="OUTLINED" variant="PRIMARY" disabled>Button</Button>

			{@render tableRowIndicator('Text')}
			<Button type="FILLED" variant="TEXT">Button</Button>
			<Button type="OUTLINED" variant="TEXT">Button</Button>
			<Button type="FILLED" variant="TEXT" disabled>Button</Button>
			<Button type="OUTLINED" variant="TEXT" disabled>Button</Button>

			{@render tableRowIndicator('Delete')}
			<Button type="FILLED" variant="DELETE">Button</Button>
			<Button type="OUTLINED" variant="DELETE">Button</Button>
			<Button type="FILLED" variant="DELETE" disabled>Button</Button>
			<Button type="OUTLINED" variant="DELETE" disabled>Button</Button>
		</div>
	</div>
</Story>
