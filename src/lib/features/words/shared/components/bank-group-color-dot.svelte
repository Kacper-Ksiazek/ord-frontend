<script lang="ts">
	import { cn } from '$lib/utils/cn';

	interface Props {
		color?: string | null;
		class?: string;
	}

	let { color, class: className = '' }: Props = $props();
</script>

{#if color}
	<span
		class={cn('size-2 shrink-0 rounded-full', className)}
		style:background-color={color}
		aria-hidden="true"
	></span>
{/if}
