<script lang="ts">
	import { setSidepanelContext } from '../sidepanel-context.svelte';

	const { children } = $props();

	// Initialize sidepanel context with mocked data for Storybook
	let sidepanelContext = $state({
		isOpened: false,
		analysisPreview: null,
		learningTipsPreviewMessageOrder: null as number | null
	});

	setSidepanelContext(sidepanelContext);
</script>

{@render children()}
