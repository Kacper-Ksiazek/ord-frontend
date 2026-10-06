<script lang="ts">
	import { cn } from '$lib/utils/cn';

	interface Props {
		title: string;
		description: string;
		'data-testid'?: string;
		class?: string;
	}

	const { title, description, 'data-testid': dataTestId, class: className = '' }: Props = $props();
</script>

<div
	class={cn(
		'flex min-h-0 flex-1 flex-col items-center justify-center rounded-[10px] border border-dashed border-line px-4 py-5 text-center',
		className
	)}
	data-testid={dataTestId}
>
	<p class="text-sm font-medium text-ink">{title}</p>
	<p class="mx-auto mt-1 max-w-[18rem] text-xs leading-relaxed text-ink-muted">{description}</p>
</div>
