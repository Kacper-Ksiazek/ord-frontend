import type {
	CreateWordRequest,
	LanguageName,
	WordFillGapsItem,
	WordFillGapsResultItem
} from '$words/types';
import { CAPTURE_WORDS_POPOVER_MAX_COUNT } from './capture-words-popover.constants';
import type { CaptureFormRow, CollectFillGapsItemsResult } from './capture-words-popover.types';

const MAX_WORD_LENGTH = 255;

export function isRowEligibleForAiFill(row: CaptureFormRow): boolean {
	return row.word.trim().length > 0 && !row.isAiGenerated;
}

function buildFillGapsItem(row: CaptureFormRow, sourceWord: string): WordFillGapsItem {
	const item: WordFillGapsItem = { sourceWord };

	const translation = row.translation?.trim();
	if (translation) {
		item.translation = translation;
	}

	const definition = row.definition?.trim();
	if (definition) {
		item.definition = definition;
	}

	if (row.type) {
		item.type = row.type;
	}

	if (row.extraMark) {
		item.extraMark = row.extraMark;
	}

	return item;
}

export function collectFillGapsItems(rows: CaptureFormRow[]): CollectFillGapsItemsResult {
	const rowIndices: number[] = [];
	const items: WordFillGapsItem[] = [];
	let hasAnyWord = false;

	for (let index = 0; index < rows.length; index++) {
		const row = rows[index];
		const trimmed = row.word.trim();
		if (!trimmed) continue;

		hasAnyWord = true;

		if (row.isAiGenerated) {
			continue;
		}

		if (trimmed.length > MAX_WORD_LENGTH) {
			return { ok: false, reason: 'word_too_long' };
		}

		rowIndices.push(index);
		items.push(buildFillGapsItem(row, trimmed));
	}

	if (items.length === 0) {
		return { ok: false, reason: hasAnyWord ? 'all_already_filled' : 'no_words' };
	}

	if (items.length > CAPTURE_WORDS_POPOVER_MAX_COUNT) {
		return { ok: false, reason: 'too_many_words' };
	}

	return { ok: true, items, rowIndices };
}

export function applyFillResultToRow(row: CaptureFormRow, result: WordFillGapsResultItem): void {
	if (result.error) {
		row.aiError = result.error;
		row.isAiGenerated = false;

		return;
	}

	row.aiError = null;
	row.isAiGenerated = true;
	row.word = result.sourceWord ?? result.inputSourceWord ?? row.word;

	if (result.translation && !(row.translation?.trim() ?? '')) {
		row.translation = result.translation;
	}

	if (result.definition && !(row.definition?.trim() ?? '')) {
		row.definition = result.definition;
		row.isDescriptionEnabled = true;
	}

	if (result.type && !row.type) {
		row.type = result.type;
	}

	if (result.extraMark && !row.extraMark) {
		row.extraMark = result.extraMark;
	}
}

export type BuildCreateWordsPayloadResult =
	| { ok: true; payload: CreateWordRequest[] }
	| { ok: false; reason: 'no_words' | 'incomplete_row'; rowIndex: number };

export function buildCreateWordsPayload(
	rows: CaptureFormRow[],
	language: LanguageName
): BuildCreateWordsPayloadResult {
	const payload: CreateWordRequest[] = [];

	for (let index = 0; index < rows.length; index++) {
		const row = rows[index];
		const sourceWord = row.word.trim();

		if (!sourceWord) {
			continue;
		}

		const translation = row.translation?.trim() ?? '';
		const definition = row.definition?.trim() ?? '';
		const type = row.type;

		if (!type || !translation || !definition) {
			return { ok: false, reason: 'incomplete_row', rowIndex: index };
		}

		payload.push({
			sourceWord,
			language,
			translation,
			definition,
			type,
			extraMark: row.extraMark ?? null
		});
	}

	if (payload.length === 0) {
		return { ok: false, reason: 'no_words', rowIndex: 0 };
	}

	return { ok: true, payload };
}
