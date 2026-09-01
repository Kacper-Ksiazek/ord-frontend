import type {
	CaptureWordRequest,
	LanguageName,
	WordFillGapsResultItem
} from '$quicklyAddedWords/types';
import { ADD_QAW_POPOVER_MAX_COUNT } from './add-qaw-popover.constants';
import type { AddQAWFormRow, CollectFillGapsItemsResult } from './add-qaw-popover.types';

const MAX_WORD_LENGTH = 255;

export function collectFillGapsItems(rows: AddQAWFormRow[]): CollectFillGapsItemsResult {
	const rowIndices: number[] = [];
	const items: { sourceWord: string }[] = [];

	for (let index = 0; index < rows.length; index++) {
		const trimmed = rows[index].word.trim();
		if (!trimmed) continue;

		if (trimmed.length > MAX_WORD_LENGTH) {
			return { ok: false, reason: 'word_too_long' };
		}

		rowIndices.push(index);
		items.push({ sourceWord: trimmed });
	}

	if (items.length === 0) {
		return { ok: false, reason: 'no_words' };
	}

	if (items.length > ADD_QAW_POPOVER_MAX_COUNT) {
		return { ok: false, reason: 'too_many_words' };
	}

	return { ok: true, items, rowIndices };
}

export function applyFillResultToRow(row: AddQAWFormRow, result: WordFillGapsResultItem): void {
	if (result.error) {
		row.aiError = result.error;

		return;
	}

	row.aiError = null;
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

export function buildBulkCreatePayload(
	rows: AddQAWFormRow[],
	language: LanguageName
): CaptureWordRequest[] {
	return rows
		.filter((row) => row.word.trim())
		.map((row) => ({
			sourceWord: row.word.trim(),
			language,
			translation: row.translation?.trim() || null,
			definition: row.definition?.trim() || null,
			type: row.type ?? null,
			extraMark: row.extraMark ?? null
		}));
}
