<script lang="ts">
	interface Props {
		text: string;
	}

	const { text }: Props = $props();
</script>

<div class="flex items-end gap-0.5">
	<span>{text}</span>

	{#each [1, 2, 3] as _, index}
		<div
			class="dot w-[3px] h-[3px] bg-gray-400 rounded-full mb-2"
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
