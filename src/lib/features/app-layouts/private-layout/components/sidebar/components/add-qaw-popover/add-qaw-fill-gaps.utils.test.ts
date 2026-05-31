import { describe, expect, it } from 'vitest';
import {
	applyFillResultToRow,
	buildBulkCreatePayload,
	collectFillGapsItems
} from './add-qaw-fill-gaps.utils';
import type { AddQAWFormRow } from './add-qaw-popover.types';

function createRow(overrides: Partial<AddQAWFormRow> = {}): AddQAWFormRow {
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
	it('returns only non-empty words in row order', () => {
		const rows = [createRow({ word: '  hello ' }), createRow(), createRow({ word: 'world' })];
		const result = collectFillGapsItems(rows);

		expect(result).toEqual({
			ok: true,
			items: [{ word: 'hello' }, { word: 'world' }],
			rowIndices: [0, 2]
		});
	});

	it('fails when no words are provided', () => {
		expect(collectFillGapsItems([createRow(), createRow()])).toEqual({
			ok: false,
			reason: 'no_words'
		});
	});
});

describe('applyFillResultToRow', () => {
	it('sets row error without changing word on failure', () => {
		const row = createRow({ word: 'xqzpw' });
		applyFillResultToRow(row, {
			inputWord: 'xqzpw',
			word: null,
			translation: null,
			definition: null,
			type: null,
			extraMark: null,
			error: 'NON_EXISTENT_WORD'
		});

		expect(row.word).toBe('xqzpw');
		expect(row.aiError).toBe('NON_EXISTENT_WORD');
	});

	it('fills empty fields on success and preserves manual translation', () => {
		const row = createRow({ word: 'verbos', translation: 'my gloss' });
		applyFillResultToRow(row, {
			inputWord: 'verbos',
			word: 'verbose',
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

describe('buildBulkCreatePayload', () => {
	it('maps description to definition and skips empty rows', () => {
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
				word: 'verbose',
				language: 'ENGLISH',
				translation: 'rozwlekły',
				definition: 'Long-winded.',
				type: 'ADJECTIVE',
				extraMark: null
			}
		]);
	});
});
