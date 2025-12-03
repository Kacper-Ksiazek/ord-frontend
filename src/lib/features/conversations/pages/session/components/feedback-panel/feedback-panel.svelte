<script lang="ts">
	import ContentCard from '$lib/components/utils/content-card.svelte';
	import { cn } from 'flowbite-svelte';

	import { getSidepanelContext } from '../../contexts/sidepanel-context.svelte';

	const { isOpened: isSidepanelOpened } = getSidepanelContext();
</script>

<ContentCard
	class={cn(
		isSidepanelOpened && 'w-[30%]', //
		!isSidepanelOpened && 'w-0 overflow-hidden scale-x-0 hidden'
	)}
>
	<h2>Conversation Details</h2>
</ContentCard>
