<script lang="ts">
	import { cn } from 'flowbite-svelte';

	interface Props {
		barClass?: string;
		wrapperClass?: string;
	}

	const { barClass = '', wrapperClass = '' }: Props = $props();

	const barBaseClasses = cn('animation-bar w-8 h-32 bg-primary-200 rounded-md', barClass);
</script>

<div class={cn('flex items-end gap-2', wrapperClass)}>
	<div class={cn(barBaseClasses)} style="animation-delay: 0s;"></div>
	<div class={cn(barBaseClasses)} style="animation-delay: 0.2s;"></div>
	<div class={cn(barBaseClasses)} style="animation-delay: 0.4s;"></div>
</div>

<style>
	@keyframes scale-y {
		0%,
		100% {
			transform: scaleY(0.1);
		}
		50% {
			transform: scaleY(1);
		}
	}

	div.animation-bar {
		animation: scale-y 1s ease-in-out infinite both;
	}
</style>
