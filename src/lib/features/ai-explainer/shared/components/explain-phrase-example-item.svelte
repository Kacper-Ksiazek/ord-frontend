<script lang="ts">
	import { PlayTextAudio } from '$lib/components/utils/play-text-audio';
	import { StreamingCaret } from '$lib/components/utils/ai-text-skeleton';
	import { highlightText, type HighlightPart } from '$lib/utils/text/highlight-segments';
	import type { LanguageName } from '$lib/types/core/domain/languages';

	interface Props {
		example: string;
		/** Phrase to bold inside the example sentence. */
		phrase: string;
		audioId: string;
		language: LanguageName;
		/** While the sentence is still streaming, audio playback is not offered yet. */
		streaming?: boolean;
		dataTestId?: string;
	}

	let { example, phrase, audioId, language, streaming = false, dataTestId }: Props = $props();

	const parts = $derived.by((): HighlightPart<'phrase'>[] => {
		const term = phrase.trim();

		return term ? highlightText(example, [{ text: term, category: 'phrase' }]) : [{ text: example }];
	});
</script>

<li
	class="group flex items-start gap-2 border-l-2 border-line py-0.5 pl-3 transition-colors hover:border-ink/30"
	data-testid={dataTestId}
>
	<span class="-my-1 shrink-0 opacity-60 transition-opacity group-hover:opacity-100">
		{#if streaming}
			<span class="block size-8" aria-hidden="true"></span>
		{:else}
			<PlayTextAudio text={example} id={audioId} {language} />
		{/if}
	</span>
	<span class="message-body min-w-0 flex-1 text-base text-ink">
		{#each parts as part, index (index)}
			{#if part.highlight}
				<span class="font-semibold">{part.text}</span>
			{:else}
				{part.text}
			{/if}
		{/each}
		{#if streaming}<StreamingCaret />{/if}
	</span>
</li>
