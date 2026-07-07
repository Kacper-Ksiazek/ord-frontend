<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'Utils/Loader',
		tags: ['autodocs']
	});
</script>

<script lang="ts">
	import Loader from './loader.svelte';
</script>

<Story name="Default">
	<div class="p-8 flex items-center justify-center">
		<Loader />
	</div>
</Story>
