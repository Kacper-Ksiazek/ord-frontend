<script lang="ts">
	import { SelectedConversationTypeCard, TopicPicker } from './components';
	import * as m from '$lib/paraglide/messages.js';
</script>

<p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
	{m['features.conversation.create.step-2.description']()}
</p>

<SelectedConversationTypeCard />
<TopicPicker />
