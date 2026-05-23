<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import Loader from '$lib/components/feedback/loader/loader.svelte';

	interface Props {
		label?: string;
		class?: string;
	}

	const { label = 'Loading...', class: customClass = '' }: Props = $props();
</script>

<div
	class={cn('flex flex-col items-center justify-center gap-5 py-16 px-8 text-center', customClass)}
>
	<div class="rounded-full bg-gray-100 dark:bg-gray-800 p-4">
		<Loader wrapperClass="scale-75" barClass="bg-gray-400 dark:bg-gray-500" />
	</div>

	{#if label}
		<p class="text-sm text-gray-500 dark:text-gray-400">
			{label}
		</p>
	{/if}
</div>
