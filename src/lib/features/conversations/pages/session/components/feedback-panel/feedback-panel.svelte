<script lang="ts">
	import ContentCard from '$lib/components/utils/content-card.svelte';
	import { cn } from 'flowbite-svelte';
	import { conversationSidepanelStore } from '../../stores';
</script>

<ContentCard
	class={cn(
		conversationSidepanelStore.isSidepanelOpened && 'w-[30%]', //
		!conversationSidepanelStore.isSidepanelOpened && 'w-0 overflow-hidden scale-x-0 hidden'
	)}
>
	<h2>Conversation Details</h2>
</ContentCard>
