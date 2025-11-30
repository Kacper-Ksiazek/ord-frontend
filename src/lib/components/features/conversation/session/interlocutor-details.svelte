<script lang="ts">
	import ContentCard from '$lib/components/utils/content-card.svelte';
	import { PageContentContainer } from '$lib/components/utils/page-content-container';
	import type { ConversationDTO } from '$lib/types/conversation/domain/conversation';
	import { Button } from 'flowbite-svelte';
	import ConversationTypeIcon from '../conversation-type-icon.svelte';
	import Icon from '../conversation-type-icon.svelte';
	import { goto } from '$app/navigation';

	interface InterlocutorDetailsProps {
		conversation: ConversationDTO;
	}

	const { conversation }: InterlocutorDetailsProps = $props();
</script>

<h2 class="text-2xl font-bold">Interlocutor Details</h2>
