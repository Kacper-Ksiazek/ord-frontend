<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import type { Snippet } from 'svelte';

	interface ConversationMetadataCardProps {
		label: string;
		value: string;
		class?: string;
		Icon: Snippet<[{ className: string }]>;
	}

	const { label, class: className, value, Icon }: ConversationMetadataCardProps = $props();
</script>

<div
	class={cn(
		'p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800',
		className
	)}
>
	<div class="flex items-center gap-3">
		{@render Icon({
			className: 'w-8 h-8 text-gray-500 dark:text-gray-400'
		})}

		<div>
			<div class="text-xs text-gray-600 dark:text-gray-300 mb-1">{label}</div>
			<div class="text- text-base font-semibold dark:text-gray-200">{value}</div>
		</div>
	</div>
</div>
