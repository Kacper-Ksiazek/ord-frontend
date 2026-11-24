<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		class?: string;
		children?: Snippet;
	}

	const { class: customClass = '', children, ...restProps }: Props = $props();
</script>

<div
	{...restProps}
	class={cn('animate-pulse rounded-md bg-accent-soft w-full h-full', customClass)}
>
	{@render children?.()}
</div>
