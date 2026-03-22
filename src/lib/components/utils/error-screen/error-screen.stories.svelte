<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import CenterComponentDecorator from '$lib/storybook/decorators/center-component-decorator.svelte';

	const { Story } = defineMeta({
		title: 'Components/ErrorScreen',
		decorators: [() => CenterComponentDecorator as any]
	});
</script>

<script lang="ts">
	import ErrorScreen from './error-screen.svelte';
</script>

<Story name="Default">
	<ErrorScreen
		errorCode={503}
		header="Failed to load data"
		description="We couldn't reach the server. Check your connection and try again."
		onRetry={() => alert('Retry clicked')}
	/>
</Story>
