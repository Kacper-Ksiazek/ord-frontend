<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { Snippet } from 'svelte';

	interface ConversationMetadataCardProps {
		label: string;
		value: string;
		class?: string;
		Icon: Snippet<[{ className: string }]>;
	}

	const { label, class: className, value, Icon }: ConversationMetadataCardProps = $props();
</script>

<div class={cn('p-4 rounded-lg border border-line bg-canvas', className)}>
	<div class="flex items-center gap-3">
		{@render Icon({
			className: 'size-10 text-ink-muted'
		})}

		<div>
			<div class="caption">{label}</div>
			<div class="content-long">{value}</div>
		</div>
	</div>
</div>
