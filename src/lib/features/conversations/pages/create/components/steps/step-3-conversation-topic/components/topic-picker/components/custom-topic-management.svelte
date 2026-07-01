<script lang="ts">
	import { onMount } from 'svelte';
	import { Toggle } from 'flowbite-svelte';
	import { AutoHeightTextarea } from '$lib/components/forms/auto-height-textarea';
	import {
		getCreateConversationPayload,
		setCreateConversationPayload
	} from '$lib/features/conversations/pages/create/stores/create-conversation-payload.svelte';
	import { topicPickerStore } from '../topic-picker.store.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { E2E_TEST_IDS } from '$lib/testing/e2e-test-ids';

	let userTopicInput = $state('');

	const topicInputDisabled = $derived.by(() => {
		const type = getCreateConversationPayload().type;

		return !type || !topicPickerStore.useOwnTopic;
	});

	function syncPayloadTopicFromInput() {
		const trimmed = userTopicInput.trim();
		setCreateConversationPayload({ topic: trimmed || undefined });
	}

	function handleUseOwnTopicChange(next: boolean) {
		topicPickerStore.useOwnTopic = next;

		if (next) {
			syncPayloadTopicFromInput();

			return;
		}

		const payload = getCreateConversationPayload();
		const list = payload.type ? topicPickerStore.getAllTopics(payload.type) : [];
		const current = payload.topic;

		if (current && !list.includes(current)) {
			setCreateConversationPayload({ topic: undefined });
		}
	}

	function handleCustomTopicInput() {
		if (topicPickerStore.useOwnTopic) {
			syncPayloadTopicFromInput();
		}
	}

	onMount(() => {
		const payload = getCreateConversationPayload();
		const list = payload.type ? topicPickerStore.getAllTopics(payload.type) : [];

		if (payload.topic && !list.includes(payload.topic)) {
			topicPickerStore.useOwnTopic = true;
			userTopicInput = payload.topic;
		} else {
			topicPickerStore.useOwnTopic = false;
			userTopicInput = '';
		}
	});
</script>

<div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
	<div class="flex flex-col min-w-0 flex-1 gap-3">
		<Toggle
			data-testid={E2E_TEST_IDS.createConversation.topicCustomToggle}
			checked={topicPickerStore.useOwnTopic}
			onchange={(e) => handleUseOwnTopicChange(e.currentTarget.checked)}
			class="shrink-0 sm:pt-1.5"
		>
			<span class="text-sm font-medium text-gray-800 dark:text-gray-200">
				{m['features.conversation.create.step-3.topic_picker.custom_topic.use_own_topic']()}
			</span>
		</Toggle>

		<div class="relative min-w-0 flex-1">
			<AutoHeightTextarea
				testId={E2E_TEST_IDS.createConversation.topicCustomInput}
				bind:value={userTopicInput}
				formField={true}
				disabled={topicInputDisabled}
				placeholder={m[
					'features.conversation.create.step-3.topic_picker.custom_topic.input_placeholder'
				]()}
				onInput={handleCustomTopicInput}
				LINE_HEIGHT={20}
				maxLength={255}
				className="py-1 px-2"
			/>
		</div>
	</div>
</div>
