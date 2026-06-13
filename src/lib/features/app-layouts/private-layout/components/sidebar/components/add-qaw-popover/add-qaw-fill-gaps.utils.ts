import type { QAWFillGapsResultItem } from '$lib/types/quickly-added-word/api/fill-gaps';
import type { CreateQAWRequest } from '$lib/types/quickly-added-word/api/requests';
import type { LanguageName } from '$lib/types/core/domain/languages';
import { ADD_QAW_POPOVER_MAX_COUNT } from './add-qaw-popover.constants';
import type { AddQAWFormRow, CollectFillGapsItemsResult } from './add-qaw-popover.types';

const MAX_WORD_LENGTH = 255;

export function collectFillGapsItems(rows: AddQAWFormRow[]): CollectFillGapsItemsResult {
	const rowIndices: number[] = [];
	const items: { word: string }[] = [];

	for (let index = 0; index < rows.length; index++) {
		const trimmed = rows[index].word.trim();
		if (!trimmed) continue;

		if (trimmed.length > MAX_WORD_LENGTH) {
			return { ok: false, reason: 'word_too_long' };
		}

		rowIndices.push(index);
		items.push({ word: trimmed });
	}

	if (items.length === 0) {
		return { ok: false, reason: 'no_words' };
	}

	if (items.length > ADD_QAW_POPOVER_MAX_COUNT) {
		return { ok: false, reason: 'too_many_words' };
	}

	return { ok: true, items, rowIndices };
}

export function applyFillResultToRow(row: AddQAWFormRow, result: QAWFillGapsResultItem): void {
	if (result.error) {
		row.aiError = result.error;

		return;
	}

	row.aiError = null;
	row.word = result.word ?? result.inputWord;

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
): CreateQAWRequest[] {
	return rows
		.filter((row) => row.word.trim())
		.map((row) => ({
			word: row.word.trim(),
			language,
			translation: row.translation?.trim() || null,
			definition: row.definition?.trim() || null,
			type: row.type ?? null,
			extraMark: row.extraMark ?? null
		}));
}
