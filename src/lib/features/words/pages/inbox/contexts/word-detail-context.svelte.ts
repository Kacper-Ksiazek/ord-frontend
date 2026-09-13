import { createContext } from 'svelte';
import type { WordListItem } from '$words/types';

export type WordDetailContext = {
	isOpened: boolean;
	selectedWordId: string | null;
	selectedWordPreview: WordListItem | null;
};

export const [getWordDetailContext, setWordDetailContext] = createContext<WordDetailContext>();

export function createWordDetailContext() {
	const context: WordDetailContext = $state({
		isOpened: false,
		selectedWordId: null,
		selectedWordPreview: null
	});

	setWordDetailContext(context);
}

export function openWordDetail(context: WordDetailContext, wordId: string, preview?: WordListItem) {
	context.selectedWordId = wordId;
	context.selectedWordPreview = preview ?? null;
	context.isOpened = true;
}

export function closeWordDetail(context: WordDetailContext) {
	context.isOpened = false;

	globalThis.setTimeout(() => {
		if (!context.isOpened) {
			context.selectedWordId = null;
			context.selectedWordPreview = null;
		}
	}, 300);
}

export function toggleWordDetail(
	context: WordDetailContext,
	wordId: string,
	preview?: WordListItem
) {
	if (context.isOpened && context.selectedWordId === wordId) {
		closeWordDetail(context);

		return;
	}

	openWordDetail(context, wordId, preview);
}
