import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
	clearCaptureWordsDraftFromStorage,
	readCaptureWordsDraftFromStorage,
	writeCaptureWordsDraftToStorage
} from './capture-words-popover.storage';

vi.mock('$lib/utils/local-storage', () => ({
	getStorageItem: vi.fn(),
	removeStorageItem: vi.fn(),
	setStorageItem: vi.fn()
}));

import { getStorageItem, removeStorageItem, setStorageItem } from '$lib/utils/local-storage';

describe('capture-words-popover.storage', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		Object.defineProperty(globalThis, 'localStorage', {
			value: {},
			configurable: true,
			writable: true
		});
	});

	describe('readCaptureWordsDraftFromStorage', () => {
		it('should return valid stored rows', () => {
			vi.mocked(getStorageItem).mockReturnValue([
				{
					isDescriptionEnabled: true,
					word: 'hello',
					translation: 'cześć',
					type: 'NOUN',
					definition: 'greeting'
				}
			]);

			const result = readCaptureWordsDraftFromStorage('user@example.com');

			expect(result).toEqual([
				{
					isDescriptionEnabled: true,
					word: 'hello',
					translation: 'cześć',
					type: 'NOUN',
					definition: 'greeting',
					isAiGenerated: false
				}
			]);
		});

		it('should return null for invalid stored data', () => {
			vi.mocked(getStorageItem).mockReturnValue([{ word: 123 }]);

			const result = readCaptureWordsDraftFromStorage('user@example.com');

			expect(result).toBeNull();
		});
	});

	describe('writeCaptureWordsDraftToStorage', () => {
		it('should persist sanitized rows', () => {
			writeCaptureWordsDraftToStorage('user@example.com', [
				{
					isDescriptionEnabled: false,
					word: 'run',
					translation: 'biegać',
					type: 'VERB',
					definition: '',
					isAiGenerated: true
				}
			]);

			expect(setStorageItem).toHaveBeenCalledWith('capture_words_draft_user@example.com', [
				{
					isDescriptionEnabled: false,
					word: 'run',
					translation: 'biegać',
					type: 'VERB',
					definition: '',
					isAiGenerated: true
				}
			]);
		});
	});

	describe('clearCaptureWordsDraftFromStorage', () => {
		it('should remove stored draft', () => {
			clearCaptureWordsDraftFromStorage('user@example.com');

			expect(removeStorageItem).toHaveBeenCalledWith('capture_words_draft_user@example.com');
		});
	});
});
