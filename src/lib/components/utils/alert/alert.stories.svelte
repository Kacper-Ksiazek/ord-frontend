<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import CenterComponentDecorator from '$lib/storybook/decorators/center-component-decorator.svelte';

	const { Story } = defineMeta({
		title: 'Utils/Alert',
		decorators: [() => CenterComponentDecorator as never]
	});
</script>

<script lang="ts">
	import { Alert } from './index';
</script>

<Story name="Default">
	<div class="flex w-[360px] flex-col gap-3">
		<Alert>
			<span class="font-medium">Error.</span>
			Could not send the code.
		</Alert>
	</div>
</Story>
