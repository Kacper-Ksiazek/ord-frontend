import { describe, expect, it } from 'vitest';
import { remainingCompletion } from './remaining-completion';

describe('remainingCompletion', () => {
	describe('positive path', () => {
		it('should keep the rest of the suggestion while the user types along with it', () => {
			const result = remainingCompletion('break the', ' ice', 'break the i');

			expect(result).toBe('ce');
		});

		it('should return the whole suggestion when nothing new was typed', () => {
			const result = remainingCompletion('break the', ' ice', 'break the');

			expect(result).toBe(' ice');
		});
	});

	describe('negative path', () => {
		it('should drop the suggestion when the typed text diverges from it', () => {
			const result = remainingCompletion('break the', ' ice', 'break the r');

			expect(result).toBeNull();
		});

		it('should drop the suggestion when the user deletes part of the prefix', () => {
			const result = remainingCompletion('break the', ' ice', 'break th');

			expect(result).toBeNull();
		});
	});

	describe('edge cases', () => {
		it('should drop the suggestion once it has been typed out completely', () => {
			const result = remainingCompletion('break the', ' ice', 'break the ice');

			expect(result).toBeNull();
		});

		it('should be case-sensitive so accepted text matches what is shown', () => {
			const result = remainingCompletion('break the', ' ice', 'break the I');

			expect(result).toBeNull();
		});
	});
});
