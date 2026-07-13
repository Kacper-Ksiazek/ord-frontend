import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { ConversationAITone } from '$conversations/types';
import {
	clearDefaultConversationToneFromStorage,
	readDefaultConversationToneFromStorage,
	writeDefaultConversationToneToStorage
} from './default-conversation-tone-storage';

vi.mock('$lib/utils/local-storage', () => ({
	getStorageItem: vi.fn(),
	removeStorageItem: vi.fn(),
	setStorageItem: vi.fn()
}));

import { getStorageItem, removeStorageItem, setStorageItem } from '$lib/utils/local-storage';

describe('readDefaultConversationToneFromStorage', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		Object.defineProperty(globalThis, 'localStorage', {
			value: {},
			configurable: true,
			writable: true
		});
	});

	describe('positive path', () => {
		it('should return a valid stored conversation tone', () => {
			vi.mocked(getStorageItem).mockReturnValue('FRIENDLY');

			const result = readDefaultConversationToneFromStorage();

			expect(result).toBe('FRIENDLY');
		});
	});

	describe('negative path', () => {
		it('should return null when storage is empty', () => {
			vi.mocked(getStorageItem).mockReturnValue(null);

			const result = readDefaultConversationToneFromStorage();

			expect(result).toBeNull();
		});

		it('should clear and return null for unknown values', () => {
			vi.mocked(getStorageItem).mockReturnValue('INVALID');

			const result = readDefaultConversationToneFromStorage();

			expect(result).toBeNull();
			expect(removeStorageItem).toHaveBeenCalledWith('default_conversation_tone');
		});
	});

	describe('edge cases', () => {
		it('should return null when localStorage is unavailable', () => {
			const originalLocalStorage = globalThis.localStorage;
			Object.defineProperty(globalThis, 'localStorage', {
				value: undefined,
				configurable: true
			});

			const result = readDefaultConversationToneFromStorage();

			expect(result).toBeNull();

			Object.defineProperty(globalThis, 'localStorage', {
				value: originalLocalStorage,
				configurable: true
			});
		});
	});
});

describe('writeDefaultConversationToneToStorage', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		Object.defineProperty(globalThis, 'localStorage', {
			value: {},
			configurable: true,
			writable: true
		});
	});

	describe('positive path', () => {
		it('should persist a conversation tone', () => {
			writeDefaultConversationToneToStorage('FRIENDLY');

			expect(setStorageItem).toHaveBeenCalledWith('default_conversation_tone', 'FRIENDLY');
		});
	});

	describe('negative path', () => {
		it('should not persist invalid conversation tones', () => {
			writeDefaultConversationToneToStorage('INVALID' as ConversationAITone);

			expect(setStorageItem).not.toHaveBeenCalled();
		});
	});
});

describe('clearDefaultConversationToneFromStorage', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('positive path', () => {
		it('should remove the stored default conversation tone', () => {
			clearDefaultConversationToneFromStorage();

			expect(removeStorageItem).toHaveBeenCalledWith('default_conversation_tone');
		});
	});
});
