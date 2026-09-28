import { describe, expect, it } from 'vitest';
import { splitExplainerStream } from './split-explainer-stream';

describe('splitExplainerStream', () => {
	describe('positive path', () => {
		it('should split the paragraph from prefixed example lines', () => {
			const view = splitExplainerStream(
				'The word "hund" means "dog".\n\n» Jeg har en hund.\n» Hunden sover.\n',
				true
			);

			expect(view.explanation).toBe('The word "hund" means "dog".');
			expect(view.examples).toEqual(['Jeg har en hund.', 'Hunden sover.']);
			expect(view.examplePartial).toBe('');
		});
	});

	describe('negative path', () => {
		it('should keep a paragraph without a blank line as the explanation', () => {
			const view = splitExplainerStream('Just one paragraph about the word.');

			expect(view.explanation).toBe('Just one paragraph about the word.');
			expect(view.examples).toEqual([]);
			expect(view.examplePartial).toBe('');
		});
	});

	describe('edge cases', () => {
		it('should keep a still-streaming example line separate from finished lines', () => {
			const view = splitExplainerStream('Meaning.\n\n» Ferdig.\n» Jeg har');

			expect(view.examples).toEqual(['Ferdig.']);
			expect(view.examplePartial).toBe('Jeg har');
		});

		it('should finalize the last example when the stream ends without a newline', () => {
			const view = splitExplainerStream('Meaning.\n\n» Jeg har en hund.', true);

			expect(view.examples).toEqual(['Jeg har en hund.']);
			expect(view.examplePartial).toBe('');
		});

		it('should ignore lines that are not example prefixes', () => {
			const view = splitExplainerStream('Meaning.\n\nnot an example\n» Real one.\n', true);

			expect(view.examples).toEqual(['Real one.']);
		});
	});
});
