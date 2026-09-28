import { describe, expect, it } from 'vitest';
import { parseAdditionalExamples, parseSimilarExpressions } from './parse-explainer-follow-up';

describe('parseAdditionalExamples', () => {
	describe('positive path', () => {
		it('should append finished lines and keep the line still streaming', () => {
			const view = parseAdditionalExamples('» Der Hund läuft.\n» Ich gehe', ['Der Hund bellt.']);

			expect(view.examples).toEqual(['Der Hund läuft.']);
			expect(view.partial).toBe('Ich gehe');
		});
	});

	describe('negative path', () => {
		it('should drop lines that repeat an example already on screen', () => {
			const view = parseAdditionalExamples('» Der Hund bellt.\n» Neuer Satz.\n', ['Der Hund bellt.']);

			expect(view.examples).toEqual(['Neuer Satz.']);
			expect(view.partial).toBe('');
		});

		it('should promote a trailing partial line when finalize is true', () => {
			const view = parseAdditionalExamples('» Neuer Satz.', [], { finalize: true });

			expect(view.examples).toEqual(['Neuer Satz.']);
			expect(view.partial).toBe('');
		});
	});
});

describe('parseSimilarExpressions', () => {
	describe('positive path', () => {
		it('should split a finished line into phrase, translation, and description', () => {
			const view = parseSimilarExpressions(
				'» Welpe | szczeniak | Młody pies.\n» Hündin | suka | Samica psa.\n'
			);

			expect(view.items).toEqual([
				{ phrase: 'Welpe', translation: 'szczeniak', description: 'Młody pies.' },
				{ phrase: 'Hündin', translation: 'suka', description: 'Samica psa.' }
			]);
			expect(view.partial).toBeNull();
		});
	});

	describe('edge cases', () => {
		it('should show a partial card while the description is still streaming', () => {
			const view = parseSimilarExpressions('» Welpe | szczeniak | Mło');

			expect(view.items).toEqual([]);
			expect(view.partial).toEqual({
				phrase: 'Welpe',
				translation: 'szczeniak',
				description: 'Mło'
			});
		});

		it('should promote a finished last line when the stream ends without a newline', () => {
			const view = parseSimilarExpressions('» Welpe | szczeniak | Młody pies.', { finalize: true });

			expect(view.items).toEqual([
				{ phrase: 'Welpe', translation: 'szczeniak', description: 'Młody pies.' }
			]);
			expect(view.partial).toBeNull();
		});
	});
});
