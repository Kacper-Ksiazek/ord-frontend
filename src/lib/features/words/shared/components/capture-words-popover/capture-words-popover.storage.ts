import { WORD_EXTRA_MARKS, WORD_TYPES } from '$words/shared/constants/enum-values';
import type { WordExtraMark, WordType } from '$words/types';
import { getStorageItem, removeStorageItem, setStorageItem } from '$lib/utils/local-storage';
import { CAPTURE_WORDS_POPOVER_MAX_COUNT } from './capture-words-popover.constants';
import type { CaptureFormRow } from './capture-words-popover.types';

export type PersistedCaptureFormRow = Omit<CaptureFormRow, 'aiError'>;

const STORAGE_KEY_PREFIX = 'capture_words_draft';

function getStorageKey(userKey: string): string {
	return `${STORAGE_KEY_PREFIX}_${userKey}`;
}

function isWordType(value: unknown): value is WordType {
	return typeof value === 'string' && WORD_TYPES.includes(value as WordType);
}

function isWordExtraMark(value: unknown): value is WordExtraMark {
	return typeof value === 'string' && WORD_EXTRA_MARKS.includes(value as WordExtraMark);
}

function parsePersistedRow(value: unknown): PersistedCaptureFormRow | null {
	if (!value || typeof value !== 'object') {
		return null;
	}

	const row = value as Partial<PersistedCaptureFormRow>;

	if (typeof row.word !== 'string' || typeof row.translation !== 'string') {
		return null;
	}

	if (typeof row.definition !== 'string') {
		return null;
	}

	if (row.type !== null && row.type !== undefined && !isWordType(row.type)) {
		return null;
	}

	if (row.extraMark !== undefined && !isWordExtraMark(row.extraMark)) {
		return null;
	}

	return {
		isDescriptionEnabled: Boolean(row.isDescriptionEnabled),
		word: row.word,
		translation: row.translation,
		type: row.type ?? null,
		extraMark: row.extraMark,
		definition: row.definition
	};
}

export function readCaptureWordsDraftFromStorage(
	userKey: string
): PersistedCaptureFormRow[] | null {
	if (typeof localStorage === 'undefined') {
		return null;
	}

	const raw = getStorageItem<unknown>(getStorageKey(userKey));

	if (!Array.isArray(raw)) {
		return null;
	}

	const rows = raw
		.map(parsePersistedRow)
		.filter((row): row is PersistedCaptureFormRow => row !== null)
		.slice(0, CAPTURE_WORDS_POPOVER_MAX_COUNT);

	if (rows.length === 0) {
		return null;
	}

	return rows;
}

export function writeCaptureWordsDraftToStorage(
	userKey: string,
	rows: PersistedCaptureFormRow[]
): void {
	if (typeof localStorage === 'undefined') {
		return;
	}

	const sanitizedRows = rows.slice(0, CAPTURE_WORDS_POPOVER_MAX_COUNT).map((row) => ({
		isDescriptionEnabled: row.isDescriptionEnabled,
		word: row.word,
		translation: row.translation,
		type: row.type,
		extraMark: row.extraMark,
		definition: row.definition
	}));

	setStorageItem(getStorageKey(userKey), sanitizedRows);
}

export function clearCaptureWordsDraftFromStorage(userKey: string): void {
	removeStorageItem(getStorageKey(userKey));
}
