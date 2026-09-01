<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import CenterComponentDecorator from '$lib/storybook/decorators/center-component-decorator.svelte';

	const { Story } = defineMeta({
		title: 'Utils/Badge',
		decorators: [() => CenterComponentDecorator as never]
	});
</script>

<script lang="ts">
	import { Badge } from './index';

	const colors = ['primary', 'gray', 'red', 'blue', 'green', 'purple', 'yellow', 'orange'] as const;
</script>

<Story name="Default">
	<div class="grid grid-cols-4 gap-3">
		{#each colors as color (color)}
			<Badge {color}>{color}</Badge>
		{/each}
	</div>
</Story>
