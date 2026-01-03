<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import type { Component } from 'svelte';
	import type { MessageFeedbackCriteria } from '$lib/types/conversation/domain/message-feedback-criteria';
	import { CheckCircleSolid, ExclamationCircleSolid, LightbulbSolid } from 'flowbite-svelte-icons';

	interface Props {
		criteria: MessageFeedbackCriteria;
		class?: string;
	}

	const { criteria, class: className }: Props = $props();

	const iconMap: Record<MessageFeedbackCriteria, Component> = {
		MISTAKES: ExclamationCircleSolid,
		STRENGTHS: CheckCircleSolid,
		SUGGESTIONS: LightbulbSolid
	};

	const Icon = $derived(iconMap[criteria]);
</script>

<Icon class={className} />
