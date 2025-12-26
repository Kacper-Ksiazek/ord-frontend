<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import type { Component } from 'svelte';
	import type { MessageFeedbackCriteria } from '$lib/types/conversation/domain/message-feedback-criteria';
	import {
		CheckCircleSolid,
		ExclamationCircleSolid,
		BookOpenSolid,
		MessageDotsSolid,
		GlobeSolid,
		StarSolid
	} from 'flowbite-svelte-icons';

	interface Props {
		criteria: MessageFeedbackCriteria;
		class?: string;
	}

	const { criteria, class: className }: Props = $props();

	const iconMap: Record<MessageFeedbackCriteria, Component> = {
		SCORES: StarSolid,
		MISTAKES: ExclamationCircleSolid,
		STRENGTHS: CheckCircleSolid,
		VOCABULARY_ENRICHMENT: BookOpenSolid,
		ALTERNATIVE_EXPRESSIONS: MessageDotsSolid,
		CULTURAL_NOTE: GlobeSolid
	};

	const Icon = $derived(iconMap[criteria]);
</script>

<Icon class={className} />
