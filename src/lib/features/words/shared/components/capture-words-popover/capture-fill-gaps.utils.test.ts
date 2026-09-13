import { describe, expect, it } from 'vitest';
import {
	applyFillResultToRow,
	buildCreateWordsPayload,
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
		isAiGenerated: false,
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

		it('should skip rows already filled by AI', () => {
			const rows = [createRow({ word: 'hello', isAiGenerated: true }), createRow({ word: 'world' })];

			const result = collectFillGapsItems(rows);

			expect(result).toEqual({
				ok: true,
				items: [{ sourceWord: 'world' }],
				rowIndices: [1]
			});
		});

		it('should include known optional fields in the request payload', () => {
			const rows = [
				createRow({
					word: 'dude',
					translation: 'stary',
					type: 'NOUN',
					extraMark: 'SLANG'
				})
			];

			const result = collectFillGapsItems(rows);

			expect(result).toEqual({
				ok: true,
				items: [
					{
						sourceWord: 'dude',
						translation: 'stary',
						type: 'NOUN',
						extraMark: 'SLANG'
					}
				],
				rowIndices: [0]
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

		it('should fail when every word was already filled by AI', () => {
			expect(
				collectFillGapsItems([
					createRow({ word: 'hello', isAiGenerated: true }),
					createRow({ word: 'world', isAiGenerated: true })
				])
			).toEqual({
				ok: false,
				reason: 'all_already_filled'
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
			expect(row.isAiGenerated).toBe(true);
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
			expect(row.isAiGenerated).toBe(false);
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

		it('should fill extra mark when the row has none', () => {
			const row = createRow({ word: 'dude' });

			applyFillResultToRow(row, {
				inputSourceWord: 'dude',
				sourceWord: 'dude',
				translation: 'stary',
				definition: 'Informal address.',
				type: 'NOUN',
				extraMark: 'SLANG',
				error: null
			});

			expect(row.extraMark).toBe('SLANG');
		});

		it('should keep an existing extra mark when the fill result also has one', () => {
			const row = createRow({ word: 'dude', extraMark: 'INFORMAL' });

			applyFillResultToRow(row, {
				inputSourceWord: 'dude',
				sourceWord: 'dude',
				translation: 'stary',
				definition: null,
				type: 'NOUN',
				extraMark: 'SLANG',
				error: null
			});

			expect(row.extraMark).toBe('INFORMAL');
		});
	});
});

describe('buildCreateWordsPayload', () => {
	describe('positive path', () => {
		it('should map description to definition and skip empty rows', () => {
			const result = buildCreateWordsPayload(
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

			expect(result).toEqual({
				ok: true,
				payload: [
					{
						sourceWord: 'verbose',
						language: 'ENGLISH',
						translation: 'rozwlekły',
						definition: 'Long-winded.',
						type: 'ADJECTIVE',
						extraMark: null
					}
				]
			});
		});
	});

	describe('negative path', () => {
		it('should return no_words when every row is blank', () => {
			expect(buildCreateWordsPayload([createRow(), createRow()], 'ENGLISH')).toEqual({
				ok: false,
				reason: 'no_words',
				rowIndex: 0
			});
		});

		it('should return incomplete_row when required fields are missing', () => {
			expect(
				buildCreateWordsPayload(
					[createRow({ word: 'verbos', translation: 'rozwlekły', type: 'ADJECTIVE' })],
					'ENGLISH'
				)
			).toEqual({
				ok: false,
				reason: 'incomplete_row',
				rowIndex: 0
			});
		});
	});

	describe('edge cases', () => {
		it('should treat whitespace-only words as empty', () => {
			expect(buildCreateWordsPayload([createRow({ word: '   ' })], 'ENGLISH')).toEqual({
				ok: false,
				reason: 'no_words',
				rowIndex: 0
			});
		});
	});
});
