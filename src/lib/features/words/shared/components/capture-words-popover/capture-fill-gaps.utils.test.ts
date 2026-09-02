import { describe, expect, it } from 'vitest';
import {
	applyFillResultToRow,
	buildBulkCreatePayload,
	collectFillGapsItems
} from './capture-fill-gaps.utils';
import type { CaptureFormRow } from './capture-words-popover.types';

function createRow(overrides: Partial<CaptureFormRow> = {}): CaptureFormRow {
	return {
		isDescriptionEnabled: false,
		word: '',
		translation: '',
		type: null,
		extraMark: undefined,
		definition: '',
		aiError: null,
		...overrides
	};
}

describe('collectFillGapsItems', () => {
	describe('positive path', () => {
		it('should return only non-empty words in row order', () => {
			const rows = [createRow({ word: '  hello ' }), createRow(), createRow({ word: 'world' })];

			const result = collectFillGapsItems(rows);

			expect(result).toEqual({
				ok: true,
				items: [{ sourceWord: 'hello' }, { sourceWord: 'world' }],
				rowIndices: [0, 2]
			});
		});
	});

	describe('negative path', () => {
		it('should fail when no words are provided', () => {
			expect(collectFillGapsItems([createRow(), createRow()])).toEqual({
				ok: false,
				reason: 'no_words'
			});
		});
	});

	describe('edge cases', () => {
		it('should fail when a word is longer than 255 characters', () => {
			expect(collectFillGapsItems([createRow({ word: 'a'.repeat(256) })])).toEqual({
				ok: false,
				reason: 'word_too_long'
			});
		});
	});
});

describe('applyFillResultToRow', () => {
	describe('positive path', () => {
		it('should fill empty fields on success and preserve manual translation', () => {
			const row = createRow({ word: 'verbos', translation: 'my gloss' });

			applyFillResultToRow(row, {
				inputSourceWord: 'verbos',
				sourceWord: 'verbose',
				translation: 'rozwlekły',
				definition: 'Long-winded.',
				type: 'ADJECTIVE',
				extraMark: null,
				error: null
			});

			expect(row.word).toBe('verbose');
			expect(row.translation).toBe('my gloss');
			expect(row.definition).toBe('Long-winded.');
			expect(row.type).toBe('ADJECTIVE');
			expect(row.isDescriptionEnabled).toBe(true);
			expect(row.aiError).toBeNull();
		});
	});

	describe('negative path', () => {
		it('should set row error without changing word on failure', () => {
			const row = createRow({ word: 'xqzpw' });

			applyFillResultToRow(row, {
				inputSourceWord: 'xqzpw',
				sourceWord: null,
				translation: null,
				definition: null,
				type: null,
				extraMark: null,
				error: 'NON_EXISTENT_WORD'
			});

			expect(row.word).toBe('xqzpw');
			expect(row.aiError).toBe('NON_EXISTENT_WORD');
		});
	});

	describe('edge cases', () => {
		it('should keep an existing type when the fill result also has a type', () => {
			const row = createRow({ word: 'run', type: 'NOUN' });

			applyFillResultToRow(row, {
				inputSourceWord: 'run',
				sourceWord: 'run',
				translation: 'biegać',
				definition: null,
				type: 'VERB',
				extraMark: null,
				error: null
			});

			expect(row.type).toBe('NOUN');
			expect(row.translation).toBe('biegać');
		});
	});
});

describe('buildBulkCreatePayload', () => {
	describe('positive path', () => {
		it('should map description to definition and skip empty rows', () => {
			const payload = buildBulkCreatePayload(
				[
					createRow({
						word: 'verbose',
						translation: 'rozwlekły',
						definition: 'Long-winded.',
						type: 'ADJECTIVE'
					}),
					createRow()
				],
				'ENGLISH'
			);

			expect(payload).toEqual([
				{
					sourceWord: 'verbose',
					language: 'ENGLISH',
					translation: 'rozwlekły',
					definition: 'Long-winded.',
					type: 'ADJECTIVE',
					extraMark: null
				}
			]);
		});
	});

	describe('negative path', () => {
		it('should return an empty array when every row is blank', () => {
			expect(buildBulkCreatePayload([createRow(), createRow()], 'ENGLISH')).toEqual([]);
		});
	});

	describe('edge cases', () => {
		it('should treat whitespace-only words as empty', () => {
			expect(buildBulkCreatePayload([createRow({ word: '   ' })], 'ENGLISH')).toEqual([]);
		});
	});
});
