<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import CenterComponentDecorator from '$lib/storybook/decorators/center-component-decorator.svelte';

	const { Story } = defineMeta({
		title: 'Utils/Spinner',
		decorators: [() => CenterComponentDecorator as never]
	});
</script>

<script lang="ts">
	import { Spinner } from './index';
</script>

<Story name="Default">
	<div class="flex items-center gap-6 text-ink">
		<Spinner />
		<Spinner size="md" />
	</div>
</Story>
