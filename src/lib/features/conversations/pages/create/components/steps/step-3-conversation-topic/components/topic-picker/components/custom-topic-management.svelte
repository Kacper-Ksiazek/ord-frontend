<script lang="ts">
	import { onMount } from 'svelte';
	import { Switch } from 'bits-ui';
	import { AutoHeightTextarea } from '$lib/components/forms/auto-height-textarea';
	import {
		getCreateConversationPayload,
		setCreateConversationPayload,
		topicPickerStore
	} from '$conversations/pages/create/stores';
	import * as m from '$lib/paraglide/messages.js';
	import { E2E_TEST_IDS } from '$conversations/testing/test-ids';

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

<div class="rounded-[10px] border border-line bg-surface px-4 py-4">
	<div class="flex min-w-0 flex-col gap-3">
		<label class="flex shrink-0 items-center gap-3">
			<Switch.Root
				data-testid={E2E_TEST_IDS.createConversation.topicCustomToggle}
				checked={topicPickerStore.useOwnTopic}
				onCheckedChange={handleUseOwnTopicChange}
				class="inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-line bg-accent-soft p-0.5 transition-colors data-[state=checked]:bg-ink"
			>
				<Switch.Thumb
					class="block size-4 rounded-full bg-white shadow-sm transition-transform data-[state=checked]:translate-x-4"
				/>
			</Switch.Root>
			<span class="text-sm font-medium text-ink">
				{m['features.conversation.create.step-3.topic_picker.custom_topic.use_own_topic']()}
			</span>
		</label>

		{#if topicPickerStore.useOwnTopic}
			<div class="relative min-w-0">
				<AutoHeightTextarea
					dataTestId={E2E_TEST_IDS.createConversation.topicCustomInput}
					bind:value={userTopicInput}
					formField={true}
					disabled={topicInputDisabled}
					placeholder={m[
						'features.conversation.create.step-3.topic_picker.custom_topic.input_placeholder'
					]()}
					onInput={handleCustomTopicInput}
					LINE_HEIGHT={22}
					minRows={2}
					maxLength={255}
					className="px-3 py-2 text-base"
				/>
			</div>
		{/if}
	</div>
</div>
