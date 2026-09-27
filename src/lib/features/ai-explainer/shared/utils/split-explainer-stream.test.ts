import { describe, expect, it } from 'vitest';
import { splitExplainerStream } from './split-explainer-stream';

describe('splitExplainerStream', () => {
	describe('positive path', () => {
		it('should split the paragraph from prefixed example lines', () => {
			const view = splitExplainerStream(
				'The word "hund" means "dog".\n\n» Jeg har en hund.\n» Hunden sover.'
			);

			expect(view.explanation).toBe('The word "hund" means "dog".');
			expect(view.examples).toEqual(['Jeg har en hund.', 'Hunden sover.']);
		});
	});

	describe('negative path', () => {
		it('should keep a paragraph without a blank line as the explanation', () => {
			const view = splitExplainerStream('Just one paragraph about the word.');

			expect(view.explanation).toBe('Just one paragraph about the word.');
			expect(view.examples).toEqual([]);
		});
	});

	describe('edge cases', () => {
		it('should show an example line that is still streaming', () => {
			const view = splitExplainerStream('Meaning.\n\n» Jeg har');

			expect(view.examples).toEqual(['Jeg har']);
		});

		it('should ignore lines that are not example prefixes', () => {
			const view = splitExplainerStream('Meaning.\n\nnot an example\n» Real one.');

			expect(view.examples).toEqual(['Real one.']);
		});
	});
});
