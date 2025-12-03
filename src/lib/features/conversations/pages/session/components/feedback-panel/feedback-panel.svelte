<script lang="ts">
	import ContentCard from '$lib/components/utils/content-card.svelte';
	import { cn } from 'flowbite-svelte';

	import { getSidepanelContext } from '../../contexts/sidepanel-context.svelte';

	const sidepanelContext = getSidepanelContext();
</script>

<ContentCard
	class={cn(
		'sticky top-[20px] flex flex-col h-[calc(100vh-82px)]',
		'bg-slate-300',
		sidepanelContext.isOpened && 'w-[30%]', //
		!sidepanelContext.isOpened && 'w-0 overflow-hidden scale-x-0 hidden'
	)}
>
	<div
		class={cn(
			'flex-1 overflow-y-auto min-h-0' // min-h-0 allows flex child to shrink below content size
		)}
	>
		{JSON.stringify(sidepanelContext.feedbackPreview)}
	</div>
</ContentCard>
