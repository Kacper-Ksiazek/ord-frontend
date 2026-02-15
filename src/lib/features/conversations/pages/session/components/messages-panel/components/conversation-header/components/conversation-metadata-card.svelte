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
			<div class="caption mb-1">{label}</div>
			<div class="heading-6">{value}</div>
		</div>
	</div>
</div>
