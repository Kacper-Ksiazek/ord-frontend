<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import CenterComponentDecorator from '$lib/storybook/decorators/center-component-decorator.svelte';

	const { Story } = defineMeta({
		title: 'Utils/LoaderScreen',
		decorators: [() => CenterComponentDecorator as any]
	});
</script>

<script lang="ts">
	import LoaderScreen from './loader-screen.svelte';
</script>

<Story name="Default">
	<LoaderScreen label="Fetching conversations..." />
</Story>
