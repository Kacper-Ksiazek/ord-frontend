import { describe, expect, it } from 'vitest';
import {
	parseEmphasisText,
	parseEmphasisTextForHeadword,
	plainTextFromEmphasisParts,
	stripEmphasisMarkers
} from './parse-emphasis-text';

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

	it('parses curly double-quote emphasis markers', () => {
		expect(
			parseEmphasisText(
				'“Audacity” means “zuchwałość” or “bezczelność” in Polish. It describes bold behavior.'
			)
		).toEqual([
			{ text: 'Audacity', emphasized: true },
			{ text: ' means ', emphasized: false },
			{ text: 'zuchwałość', emphasized: true },
			{ text: ' or ', emphasized: false },
			{ text: 'bezczelność', emphasized: true },
			{ text: ' in Polish. It describes bold behavior.', emphasized: false }
		]);
	});

	it('returns plain text when no markers are present', () => {
		expect(parseEmphasisText('Plain definition.')).toEqual([
			{ text: 'Plain definition.', emphasized: false }
		]);
	});
});

describe('parseEmphasisTextForHeadword', () => {
	it('demotes emphasis when the fragment equals the headword', () => {
		expect(
			parseEmphasisTextForHeadword('A concise definition of "verbose" for practice.', 'verbose')
		).toEqual([
			{ text: 'A concise definition of ', emphasized: false },
			{ text: 'verbose', emphasized: false },
			{ text: ' for practice.', emphasized: false }
		]);
	});

	it('keeps other emphasized fragments', () => {
		expect(parseEmphasisTextForHeadword('Means *bold* behavior.', 'bold')).toEqual([
			{ text: 'Means ', emphasized: false },
			{ text: 'bold', emphasized: false },
			{ text: ' behavior.', emphasized: false }
		]);
	});
});

describe('plainTextFromEmphasisParts', () => {
	it('joins part text without markers', () => {
		expect(
			plainTextFromEmphasisParts([
				{ text: 'A ', emphasized: false },
				{ text: 'word', emphasized: false },
				{ text: '.', emphasized: false }
			])
		).toBe('A word.');
	});
});

describe('stripEmphasisMarkers', () => {
	it('removes emphasis markers from text', () => {
		expect(stripEmphasisMarkers('Stock prices can be *capricious*, driven by rumors.')).toBe(
			'Stock prices can be capricious, driven by rumors.'
		);
	});
});
