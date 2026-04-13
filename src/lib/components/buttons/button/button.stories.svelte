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

	let hotkeyClicks = $state(0);
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
			<Button type="FILLED" variant="PRIMARY" hotkey="Mod+1">Button</Button>
			<Button type="OUTLINED" variant="PRIMARY" hotkey="Mod+2">Button</Button>
			<Button type="FILLED" variant="PRIMARY" disabled hotkey="Mod+3">Button</Button>
			<Button type="OUTLINED" variant="PRIMARY" disabled hotkey="Mod+4">Button</Button>

			{@render tableRowIndicator('Text')}
			<Button type="FILLED" variant="TEXT" hotkey="Mod+5">Button</Button>
			<Button type="OUTLINED" variant="TEXT" hotkey="Mod+6">Button</Button>
			<Button type="FILLED" variant="TEXT" disabled hotkey="Mod+7">Button</Button>
			<Button type="OUTLINED" variant="TEXT" disabled hotkey="Mod+8">Button</Button>

			{@render tableRowIndicator('Delete')}
			<Button type="FILLED" variant="DELETE" hotkey="Mod+9">Button</Button>
			<Button type="OUTLINED" variant="DELETE" hotkey="Mod+0">Button</Button>
			<Button type="FILLED" variant="DELETE" disabled hotkey="Mod+Alt+1">Button</Button>
			<Button type="OUTLINED" variant="DELETE" disabled hotkey="Mod+Alt+2">Button</Button>
		</div>
	</div>
</Story>

<Story name="With hotkey">
	<div class="flex flex-col items-center gap-3">
		<Button type="FILLED" variant="PRIMARY" hotkey="Mod+Enter" onClick={() => hotkeyClicks++}>
			Submit
		</Button>
		<p class="text-sm text-gray-600 dark:text-gray-400">
			Clicks: {hotkeyClicks} — use the shortcut or click the button.
		</p>
	</div>
</Story>
