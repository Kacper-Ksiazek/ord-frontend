<script lang="ts">
	import { setConversationContext } from '../conversation-context.svelte';

	const { children } = $props();

	// Initialize conversation context with mocked data for Storybook
	setConversationContext({
		id: 'storybook-conversation',
		topic: 'Learning English',
		type: 'SMALL_TALK',
		aiTone: 'FRIENDLY',
		interlocutor: {
			name: 'Alex',
			avatarId: 'AVATAR_EPSILON'
		}
	});
</script>

{@render children()}
