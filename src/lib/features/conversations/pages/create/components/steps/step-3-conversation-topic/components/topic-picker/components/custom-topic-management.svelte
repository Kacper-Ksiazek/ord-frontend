<script lang="ts">
	import { onMount } from 'svelte';
	import { Input } from '$lib/components/forms/input';
	import { cn } from '$lib/utils/cn';
	import { Check, PenLine } from 'lucide-svelte';
	import {
		getCreateConversationPayload,
		setCreateConversationPayload,
		topicPickerStore
	} from '$conversations/pages/create/stores';
	import * as m from '$lib/paraglide/messages.js';
	import { E2E_TEST_IDS } from '$conversations/testing/test-ids';

	let userTopicInput = $state('');

	const ownTopicLabel = $derived(
		m['features.conversation.create.step-3.topic_picker.custom_topic.use_own_topic']()
	);

	const hasConversationType = $derived.by(() => Boolean(getCreateConversationPayload().type));

	const isOwnTopicSelected = $derived(topicPickerStore.useOwnTopic);

	function syncPayloadTopicFromInput() {
		const trimmed = userTopicInput.trim();
		setCreateConversationPayload({ topic: trimmed || undefined });
	}

	function setUseOwnTopic(next: boolean) {
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

	function handleCheckboxToggle(event: MouseEvent) {
		event.stopPropagation();
		if (!hasConversationType) {
			return;
		}
		setUseOwnTopic(!isOwnTopicSelected);
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

<div class="flex min-h-0 flex-col gap-2">
	<p class="text-sm font-medium text-ink-muted">
		{m['features.conversation.create.step-3.topic_picker.custom_topic.section_title']()}
	</p>

	<div
		class={cn(
			'flex flex-row items-center gap-1 rounded-[10px] border border-line bg-surface p-2',
			isOwnTopicSelected && 'border-ink'
		)}
	>
		<button
			type="button"
			role="checkbox"
			aria-checked={isOwnTopicSelected}
			aria-label={ownTopicLabel}
			data-testid={E2E_TEST_IDS.createConversation.topicCustomToggle}
			class={cn(
				'inline-flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors',
				'hover:bg-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20',
				!hasConversationType && 'cursor-not-allowed'
			)}
			disabled={!hasConversationType}
			onclick={handleCheckboxToggle}
		>
			<span
				class={cn(
					'flex size-7 items-center justify-center rounded-[5px] border-2 transition-colors',
					isOwnTopicSelected ? 'border-ink bg-ink text-surface' : 'border-line bg-surface'
				)}
				aria-hidden="true"
			>
				{#if isOwnTopicSelected}
					<Check class="size-3.5" strokeWidth={3} />
				{/if}
			</span>
		</button>

		<span
			class="inline-flex size-7 shrink-0 items-center justify-center text-ink-muted"
			aria-hidden="true"
		>
			<PenLine class="size-4" />
		</span>

		<Input
			dataTestId={E2E_TEST_IDS.createConversation.topicCustomInput}
			bind:value={userTopicInput}
			disabled={!hasConversationType}
			placeholder={m[
				'features.conversation.create.step-3.topic_picker.custom_topic.input_placeholder'
			]()}
			onInput={handleCustomTopicInput}
			maxLength={255}
			class="min-w-0 flex-1"
			inputClass="h-7 min-h-0 border-0 bg-transparent px-0 py-0 text-sm font-medium leading-snug text-ink shadow-none hover:bg-transparent focus:border-transparent focus:outline-none focus:ring-0 focus:ring-offset-0"
		/>
	</div>
</div>
