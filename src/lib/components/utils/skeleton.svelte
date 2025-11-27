<script lang="ts">
import { cn } from 'flowbite-svelte';
import type { Snippet } from 'svelte';

interface Props {
	class?: string;
	children?: Snippet;
}

const { class: customClass = '', children }: Props = $props();
</script>

<div
  class={cn(
    "bg-gray-200 dark:bg-gray-800 animate-pulse w-full h-full rounded-md",
    customClass
  )}
>
  {@render children?.()}
</div>
