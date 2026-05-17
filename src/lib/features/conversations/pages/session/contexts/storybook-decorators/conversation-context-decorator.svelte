<script lang="ts">
	import { setConversationContext } from '../conversation-context.svelte';

	const { children } = $props();

	setConversationContext({
		id: 'storybook-conversation',
		topic: 'Learning English',
		type: 'SMALL_TALK',
		aiTone: 'FRIENDLY',
		proficiencyLevel: 'B1',
		interlocutor: {
			name: 'Alex',
			avatarId: 'AVATAR_EPSILON'
		},
		createdAt: new Date('2026-04-01T12:00:00').toISOString()
	});
</script>

{@render children()}
