<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import CenterComponentDecorator from '$lib/storybook/decorators/center-component-decorator.svelte';

	const { Story } = defineMeta({
		title: 'Components/Forms/IconButton',
		decorators: [() => CenterComponentDecorator as any]
	});
</script>

<script lang="ts">
	import { IconButton } from './index';
	import { Search, Settings, Pencil, Trash2 } from 'lucide-svelte';
</script>

<Story name="Default">
	<div>
		<h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Icon Buttons</h3>

		<div class="flex items-center gap-4">
			<IconButton icon={Search} ariaLabel="Search" tooltip="Search" />
			<IconButton icon={Settings} ariaLabel="Settings" tooltip="Settings" />
			<IconButton icon={Pencil} ariaLabel="Edit" tooltip="Edit" />
			<IconButton icon={Trash2} ariaLabel="Delete" tooltip="Delete" disabled />
		</div>
	</div>
</Story>
