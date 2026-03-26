<script lang="ts">
	import { setConversationContext } from '../conversation-context.svelte';

	const { children } = $props();

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
