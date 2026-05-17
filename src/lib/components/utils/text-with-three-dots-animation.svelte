<script lang="ts">
	import { cn } from 'flowbite-svelte';

	interface Props {
		text: string;
		dotsWrapperClass?: string;
	}

	const { text, dotsWrapperClass = '' }: Props = $props();
</script>

<div class="flex items-end gap-0.5">
	<span>{text}</span>

	{#each [0, 1, 2] as index (index)}
		<div
			class={cn('dot w-[3px] h-[3px] bg-gray-400 rounded-full mb-2', dotsWrapperClass)}
			style="animation-delay: {index * 0.1}s;"
		></div>
	{/each}
</div>

<style>
	@keyframes opacity-transition {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.dot {
		animation: opacity-transition 0.5s infinite alternate linear;
	}
</style>
