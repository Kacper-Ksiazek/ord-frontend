<script lang="ts">
import { cn } from 'flowbite-svelte';

interface Props {
	class?: string;
}

const { class: customClass = '' }: Props = $props();
</script>

<div
  class={cn(
    "bg-gray-200 dark:bg-gray-800 animate-pulse w-full h-full rounded-md",
    customClass
  )}
></div>
