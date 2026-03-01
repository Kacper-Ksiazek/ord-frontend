<script lang="ts">
	import Button from '$lib/components/buttons/button/button.svelte';
	import { cn } from 'flowbite-svelte';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';

	interface PreviewContentProps {
		isSelected?: boolean;
	}

	let { isSelected = false }: PreviewContentProps = $props();

	function onClick(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();

		alert('Preview content');
	}

	const { Icon, label } = $derived.by(() => {
		if (isSelected) {
			return {
				Icon: ChevronLeft,
				label: 'Hide details'
			};
		} else {
			return {
				Icon: ChevronRight,
				label: 'Show details'
			};
		}
	});
</script>

<Button
	{onClick}
	type="OUTLINED"
	variant="TEXT"
	class={cn(isSelected && 'ring-2 ring-primary-300 mr-2')}
>
	<Icon class="w-4 h-4 mr-1" />

	<span class={cn('text-sm font-medium', isSelected && 'text-primary-600 dark:text-primary-400')}>
		{label}
	</span>
</Button>
