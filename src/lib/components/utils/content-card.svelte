<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		class?: string;
		children: Snippet;
	}

	const { class: customClass = '', children, ...restProps }: Props = $props();
</script>

<div {...restProps} class={cn('rounded-2xl flex min-w-0 w-full flex-col', customClass)}>
	{@render children()}
</div>
