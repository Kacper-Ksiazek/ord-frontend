<script lang="ts">
	import { setSidepanelContext } from '$conversations/pages/session/contexts/sidepanel-context.svelte';

	setSidepanelContext({
		isOpened: true,
		summaryTab: 'verdict',
		filterMessageOrder: null,
		scrollToMessageIndex: null
	});
</script>
