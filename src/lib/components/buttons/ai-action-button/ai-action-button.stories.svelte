<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'Components/Buttons/AiActionButton'
	});
</script>

<script lang="ts">
	import AiActionButton from './ai-action-button.svelte';
	import { onMount } from 'svelte';

	type Status = 'default' | 'loading' | 'success' | 'failed';

	let buttonStatus: Status = 'default';

	function handleGenerate() {
		buttonStatus = 'loading';
		setTimeout(() => {
			buttonStatus = Math.random() > 0.5 ? 'success' : 'failed';
		}, 2500);
	}

	onMount(() => {
		buttonStatus = 'default';
	});
</script>

<Story name="Default">
	<section class="flex flex-col justify-start items-start">
		<div class="p-8 bg-white">
			<span class="text-2xl font-bold">Action: <strong>{buttonStatus}</strong></span>
		</div>
		<AiActionButton status={buttonStatus} onclick={handleGenerate} />

		<!-- <section class="flex flex-col justify-start items-start gap-4 mt-10">
      <AiActionButton status="default" onclick={handleGenerate} />
      <AiActionButton status="loading" onclick={handleGenerate} />
      <AiActionButton status="success" onclick={handleGenerate} />
      <AiActionButton status="failed" onclick={handleGenerate} />
    </section> -->
	</section>
</Story>
