<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import type { MessageAnalysisCriteria } from '$conversations/types';
	import { USER_MESSAGE_ANALYSIS_ICONS_MAP } from '$conversations/pages/session/constants/user-message-analysis/icons';
	import { getUserMessageAnalysisColors } from '$conversations/pages/session/constants/user-message-analysis/colors';

	interface Props {
		criteria: MessageAnalysisCriteria;
		class?: string;
	}

	const { criteria, class: className }: Props = $props();

	const Icon = $derived(USER_MESSAGE_ANALYSIS_ICONS_MAP[criteria]);
</script>

<Icon
	class={cn(
		getUserMessageAnalysisColors(criteria).text, //
		className
	)}
/>
