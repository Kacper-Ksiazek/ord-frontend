<script lang="ts">
	import { setSidepanelContext } from '../sidepanel-context.svelte';

	const { children } = $props();

	// Initialize sidepanel context with mocked data for Storybook
	let sidepanelContext = $state({
		isOpened: false,
		feedbackPreview: null
	});

	setSidepanelContext(sidepanelContext);
</script>

{@render children()}
