import { describe, expect, it } from 'vitest';
import { parseEmphasisText } from './parse-emphasis-text';

describe('parseEmphasisText', () => {
	it('parses single-asterisk emphasis markers', () => {
		expect(parseEmphasisText('A *shed* is simple.')).toEqual([
			{ text: 'A ', emphasized: false },
			{ text: 'shed', emphasized: true },
			{ text: ' is simple.', emphasized: false }
		]);
	});

	it('parses single-quote emphasis markers', () => {
		expect(
			parseEmphasisText(
				"A 'brick-and-mortar' refers to a physical retail store that operates from a traditional building."
			)
		).toEqual([
			{ text: 'A ', emphasized: false },
			{ text: 'brick-and-mortar', emphasized: true },
			{
				text: ' refers to a physical retail store that operates from a traditional building.',
				emphasized: false
			}
		]);
	});

	it('parses asterisk and quote markers in the same sentence', () => {
		expect(parseEmphasisText("A *spur* or 'spur' motivates action.")).toEqual([
			{ text: 'A ', emphasized: false },
			{ text: 'spur', emphasized: true },
			{ text: ' or ', emphasized: false },
			{ text: 'spur', emphasized: true },
			{ text: ' motivates action.', emphasized: false }
		]);
	});

	it('parses multiple emphasized fragments', () => {
		expect(parseEmphasisText('*Test* sentence. Another *test* sentence.')).toEqual([
			{ text: 'Test', emphasized: true },
			{ text: ' sentence. Another ', emphasized: false },
			{ text: 'test', emphasized: true },
			{ text: ' sentence.', emphasized: false }
		]);
	});

	it('returns plain text when no markers are present', () => {
		expect(parseEmphasisText('Plain definition.')).toEqual([
			{ text: 'Plain definition.', emphasized: false }
		]);
	});
});
