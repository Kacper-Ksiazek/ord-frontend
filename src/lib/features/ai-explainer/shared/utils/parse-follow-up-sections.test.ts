import { describe, expect, it } from 'vitest';
import { parseCommonMistakes, parseUsedWith } from './parse-follow-up-sections';

describe('parseCommonMistakes', () => {
	it('splits blank-line separated blocks into wrong / right / why', () => {
		const raw =
			'✗ I *have been knowing* her.\n✓ I *have known* her.\nKnow is a stative verb.\n\n✗ I *work* here since 2020.\n✓ I *have worked* here since 2020.\nUse the present perfect.';

		expect(parseCommonMistakes(raw)).toEqual([
			{
				wrong: 'I *have been knowing* her.',
				right: 'I *have known* her.',
				why: 'Know is a stative verb.'
			},
			{
				wrong: 'I *work* here since 2020.',
				right: 'I *have worked* here since 2020.',
				why: 'Use the present perfect.'
			}
		]);
	});

	it('keeps a block that is still streaming', () => {
		expect(parseCommonMistakes('✗ I *am knowing* her.\n✓ I *kn')).toEqual([
			{ wrong: 'I *am knowing* her.', right: 'I *kn', why: '' }
		]);
	});

	it('returns null for text without the markers so it can be shown as plain text', () => {
		expect(parseCommonMistakes('I read the content. → I read the contents.')).toBeNull();
	});
});

describe('parseUsedWith', () => {
	it('splits emphasised combinations from their notes', () => {
		expect(
			parseUsedWith('*high-quality content* — useful material\n*online content* — published online')
		).toEqual([
			{ term: 'high-quality content', note: 'useful material' },
			{ term: 'online content', note: 'published online' }
		]);
	});

	it('accepts markdown bold and lines without emphasis', () => {
		expect(
			parseUsedWith('**content creator** — someone who makes material\nplain line — note')
		).toEqual([
			{ term: 'content creator', note: 'someone who makes material' },
			{ term: 'plain line', note: 'note' }
		]);
	});
});
