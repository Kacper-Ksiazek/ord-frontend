<script lang="ts">
	import { Button } from '$lib/components/buttons/button';
	import { Input } from '$lib/components/forms/input';
	import { AutoHeightTextarea } from '$lib/components/forms/auto-height-textarea';
	import type { CreateWordDetailsRequest } from '$words/api-client/api/http-post-create-word-details';
	import * as m from '$lib/paraglide/messages.js';
	import { E2E_TEST_IDS } from '$words/testing/test-ids';

	interface Props {
		disabled?: boolean;
		onCancel: () => void;
		onSave: (request: CreateWordDetailsRequest) => void | Promise<void>;
	}

	let { disabled = false, onCancel, onSave }: Props = $props();

	let synonyms = $state('');
	let useCases = $state('');

	function parseCommaSeparated(value: string) {
		return value
			.split(',')
			.map((item) => item.trim())
			.filter(Boolean);
	}

	function parseLines(value: string) {
		return value
			.split('\n')
			.map((item) => item.trim())
			.filter(Boolean);
	}

	async function handleSave() {
		await onSave({
			useCases: parseLines(useCases),
			synonyms: parseCommaSeparated(synonyms),
			antonyms: [],
			commonMistakes: [],
			exampleSentences: [],
			collocations: [],
			pronunciation: null,
			grammar: null,
			culturalNotes: null,
			learningTips: null
		});
	}
</script>

<div
	class="flex min-h-0 flex-1 flex-col gap-4 px-6 py-5"
	data-testid={E2E_TEST_IDS.inbox.detailManualForm}
>
	<div class="space-y-1">
		<h3 class="text-sm font-medium text-ink">
			{m['features.words.inbox.detail.manual_form_title']()}
		</h3>
		<p class="text-sm text-ink-muted">
			{m['features.words.inbox.detail.manual_form_description']()}
		</p>
	</div>

	<div class="space-y-4">
		<div class="space-y-2">
			<label class="text-sm font-medium text-ink" for="word-manual-synonyms">
				{m['features.words.inbox.detail.manual_synonyms_label']()}
			</label>
			<Input
				id="word-manual-synonyms"
				bind:value={synonyms}
				placeholder={m['features.words.inbox.detail.manual_synonyms_placeholder']()}
				{disabled}
			/>
		</div>

		<div class="space-y-2">
			<label class="text-sm font-medium text-ink" for="word-manual-use-cases">
				{m['features.words.inbox.detail.manual_use_cases_label']()}
			</label>
			<AutoHeightTextarea
				bind:value={useCases}
				placeholder={m['features.words.inbox.detail.manual_use_cases_placeholder']()}
				{disabled}
				formField
			/>
		</div>
	</div>

	<div class="mt-auto flex flex-col gap-2 sm:flex-row sm:justify-end">
		<Button type="OUTLINED" variant="TEXT" {disabled} onClick={onCancel}>
			{m['features.words.inbox.detail.manual_cancel']()}
		</Button>
		<Button {disabled} onClick={() => void handleSave()}>
			{m['features.words.inbox.detail.manual_save']()}
		</Button>
	</div>
</div>
