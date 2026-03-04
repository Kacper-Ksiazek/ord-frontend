import { describe, it, expect } from 'vitest';
import { filterUserMessageReviews } from './filter-user-message-reviews';
import type {
	AggregatedFeedbackItem,
	AggregatedMistake,
	AggregatedSuggestion
} from '../../components/user-message-reviews-filters/utils/aggregate-feedback/aggregate-feedback.types';
import type { UserMessageReviewFilters } from '$conversations/pages/session/components/feedback-panel/components/user-message-reviews-filters/lib/filters';

const CREATED_AT = new Date('2024-01-01T10:00:00.000Z');

const makeMistake = (
	overrides: Partial<
		AggregatedFeedbackItem & { data: Partial<AggregatedFeedbackItem['data']> } & {
			severity?: 'MINOR' | 'MODERATE' | 'CRITICAL';
		}
	> = {}
): AggregatedFeedbackItem => {
	const dataOverrides = overrides.data || {};
	const { data: _, phrase, severity, ...topLevelOverrides } = overrides;
	const finalPhrase = phrase || 'I goed to store';
	const finalSeverity: 'MINOR' | 'MODERATE' | 'CRITICAL' = severity || 'MINOR';

	return {
		type: 'MISTAKES',
		data: {
			phrase: finalPhrase,
			correctForm: 'I went to the store',
			explanation: 'Irregular verb',
			severity: finalSeverity,
			errorType: 'GRAMMAR' as const,
			...dataOverrides
		},
		phrase: finalPhrase,
		explanation: 'Irregular verb',
		createdAt: CREATED_AT,
		searchableText: 'i goed to store i went to the store irregular verb',
		...topLevelOverrides
	} as AggregatedFeedbackItem;
};

const makeStrength = (
	overrides: Partial<AggregatedFeedbackItem & { data: Partial<AggregatedFeedbackItem['data']> }> = {}
): AggregatedFeedbackItem => {
	const dataOverrides = overrides.data || {};
	const { data: _, phrase, ...topLevelOverrides } = overrides;
	const finalPhrase = phrase || 'Nevertheless';

	return {
		type: 'STRENGTHS',
		data: {
			phrase: finalPhrase,
			explanation: 'Good use of connective',
			strengthType: 'VOCABULARY' as const,
			...dataOverrides
		},
		phrase: finalPhrase,
		explanation: 'Good use of connective',
		createdAt: CREATED_AT,
		searchableText: 'nevertheless good use of connective',
		...topLevelOverrides
	} as AggregatedFeedbackItem;
};

const makeSuggestion = (
	overrides: Partial<
		AggregatedFeedbackItem & { data: Partial<AggregatedFeedbackItem['data']> } & {
			suggestionType?: 'VOCABULARY' | 'STRUCTURE';
		}
	> = {}
): AggregatedFeedbackItem => {
	const dataOverrides = overrides.data || {};
	const { data: _, phrase, suggestionType, ...topLevelOverrides } = overrides;
	const finalPhrase = phrase || 'very big';
	const finalSuggestionType: 'VOCABULARY' | 'STRUCTURE' = suggestionType || 'VOCABULARY';

	return {
		type: 'SUGGESTIONS',
		data: {
			original: finalPhrase,
			alternatives: ['enormous', 'huge'],
			explanation: 'More precise vocabulary',
			suggestionType: finalSuggestionType,
			...dataOverrides
		},
		phrase: finalPhrase,
		explanation: 'More precise vocabulary',
		createdAt: CREATED_AT,
		searchableText: 'very big enormous huge more precise vocabulary',
		...topLevelOverrides
	} as AggregatedFeedbackItem;
};

describe('filterUserMessageReviews', () => {
	describe('positive path', () => {
		it('should return all items when all filters are set to ALL', () => {
			const items: AggregatedFeedbackItem[] = [makeMistake(), makeStrength(), makeSuggestion()];
			const filters: UserMessageReviewFilters = {
				category: 'ALL',
				searchQuery: '',
				mistakeSeverity: 'ALL',
				suggestionType: 'ALL'
			};

			const result = filterUserMessageReviews(items, filters);

			expect(result).toHaveLength(3);
			expect(result).toEqual(items);
		});

		it('should filter by category when category is MISTAKES', () => {
			const items: AggregatedFeedbackItem[] = [makeMistake(), makeStrength(), makeSuggestion()];
			const filters: UserMessageReviewFilters = {
				category: 'MISTAKES',
				searchQuery: '',
				mistakeSeverity: 'ALL',
				suggestionType: 'ALL'
			};

			const result = filterUserMessageReviews(items, filters);

			expect(result).toHaveLength(1);
			expect(result[0].type).toBe('MISTAKES');
		});

		it('should filter by category when category is STRENGTHS', () => {
			const items: AggregatedFeedbackItem[] = [makeMistake(), makeStrength(), makeSuggestion()];
			const filters: UserMessageReviewFilters = {
				category: 'STRENGTHS',
				searchQuery: '',
				mistakeSeverity: 'ALL',
				suggestionType: 'ALL'
			};

			const result = filterUserMessageReviews(items, filters);

			expect(result).toHaveLength(1);
			expect(result[0].type).toBe('STRENGTHS');
		});

		it('should filter by category when category is SUGGESTIONS', () => {
			const items: AggregatedFeedbackItem[] = [makeMistake(), makeStrength(), makeSuggestion()];
			const filters: UserMessageReviewFilters = {
				category: 'SUGGESTIONS',
				searchQuery: '',
				mistakeSeverity: 'ALL',
				suggestionType: 'ALL'
			};

			const result = filterUserMessageReviews(items, filters);

			expect(result).toHaveLength(1);
			expect(result[0].type).toBe('SUGGESTIONS');
		});

		it('should filter by mistake severity when category is MISTAKES', () => {
			const items: AggregatedFeedbackItem[] = [
				makeMistake({ severity: 'MINOR' }),
				makeMistake({ severity: 'MODERATE' }),
				makeMistake({ severity: 'CRITICAL' })
			];
			const filters: UserMessageReviewFilters = {
				category: 'MISTAKES',
				searchQuery: '',
				mistakeSeverity: 'MODERATE',
				suggestionType: 'ALL'
			};

			const result = filterUserMessageReviews(items, filters);

			expect(result).toHaveLength(1);
			expect((result[0] as AggregatedMistake).data.severity).toBe('MODERATE');
		});

		it('should filter by suggestion type when category is SUGGESTIONS', () => {
			const items: AggregatedFeedbackItem[] = [
				makeSuggestion({ suggestionType: 'VOCABULARY' }),
				makeSuggestion({ suggestionType: 'STRUCTURE' })
			];
			const filters: UserMessageReviewFilters = {
				category: 'SUGGESTIONS',
				searchQuery: '',
				mistakeSeverity: 'ALL',
				suggestionType: 'VOCABULARY'
			};

			const result = filterUserMessageReviews(items, filters);

			expect(result).toHaveLength(1);
			expect((result[0] as AggregatedSuggestion).data.suggestionType).toBe('VOCABULARY');
		});

		it('should filter by search query when searchQuery is provided', () => {
			const items: AggregatedFeedbackItem[] = [
				makeMistake({ phrase: 'Hello world', searchableText: 'hello world test' }),
				makeMistake({ phrase: 'Goodbye', searchableText: 'goodbye test' })
			];
			const filters: UserMessageReviewFilters = {
				category: 'ALL',
				searchQuery: 'hello',
				mistakeSeverity: 'ALL',
				suggestionType: 'ALL'
			};

			const result = filterUserMessageReviews(items, filters);

			expect(result).toHaveLength(1);
			expect(result[0].phrase).toBe('Hello world');
		});

		it('should apply multiple filters simultaneously', () => {
			const items: AggregatedFeedbackItem[] = [
				makeMistake({ severity: 'MINOR', phrase: 'test', searchableText: 'test mistake' }),
				makeMistake({ severity: 'MINOR', phrase: 'other', searchableText: 'other mistake' }),
				makeMistake({ severity: 'MODERATE', phrase: 'test', searchableText: 'test mistake' })
			];
			const filters: UserMessageReviewFilters = {
				category: 'MISTAKES',
				searchQuery: 'test',
				mistakeSeverity: 'MINOR',
				suggestionType: 'ALL'
			};

			const result = filterUserMessageReviews(items, filters);

			expect(result).toHaveLength(1);
			expect((result[0] as AggregatedMistake).data.severity).toBe('MINOR');
			expect(result[0].phrase).toBe('test');
		});

		it('should handle case-insensitive search query', () => {
			const items: AggregatedFeedbackItem[] = [makeMistake({ searchableText: 'hello world test' })];
			const filters: UserMessageReviewFilters = {
				category: 'ALL',
				searchQuery: 'HELLO',
				mistakeSeverity: 'ALL',
				suggestionType: 'ALL'
			};

			const result = filterUserMessageReviews(items, filters);

			expect(result).toHaveLength(1);
		});

		it('should trim search query before filtering', () => {
			const items: AggregatedFeedbackItem[] = [makeMistake({ searchableText: 'hello world test' })];
			const filters: UserMessageReviewFilters = {
				category: 'ALL',
				searchQuery: '  hello  ',
				mistakeSeverity: 'ALL',
				suggestionType: 'ALL'
			};

			const result = filterUserMessageReviews(items, filters);

			expect(result).toHaveLength(1);
		});
	});

	describe('negative path', () => {
		it('should return empty array when no items match category filter', () => {
			const items: AggregatedFeedbackItem[] = [makeMistake(), makeStrength()];
			const filters: UserMessageReviewFilters = {
				category: 'SUGGESTIONS',
				searchQuery: '',
				mistakeSeverity: 'ALL',
				suggestionType: 'ALL'
			};

			const result = filterUserMessageReviews(items, filters);

			expect(result).toEqual([]);
		});

		it('should return empty array when no items match mistake severity filter', () => {
			const items: AggregatedFeedbackItem[] = [
				makeMistake({ severity: 'MINOR' }),
				makeMistake({ severity: 'MODERATE' })
			];
			const filters: UserMessageReviewFilters = {
				category: 'MISTAKES',
				searchQuery: '',
				mistakeSeverity: 'CRITICAL',
				suggestionType: 'ALL'
			};

			const result = filterUserMessageReviews(items, filters);

			expect(result).toEqual([]);
		});

		it('should return empty array when no items match suggestion type filter', () => {
			const items: AggregatedFeedbackItem[] = [makeSuggestion({ suggestionType: 'VOCABULARY' })];
			const filters: UserMessageReviewFilters = {
				category: 'SUGGESTIONS',
				searchQuery: '',
				mistakeSeverity: 'ALL',
				suggestionType: 'STRUCTURE'
			};

			const result = filterUserMessageReviews(items, filters);

			expect(result).toEqual([]);
		});

		it('should return empty array when no items match search query', () => {
			const items: AggregatedFeedbackItem[] = [makeMistake({ searchableText: 'hello world' })];
			const filters: UserMessageReviewFilters = {
				category: 'ALL',
				searchQuery: 'nonexistent',
				mistakeSeverity: 'ALL',
				suggestionType: 'ALL'
			};

			const result = filterUserMessageReviews(items, filters);

			expect(result).toEqual([]);
		});

		it('should not apply mistake severity filter when category is not MISTAKES', () => {
			const items: AggregatedFeedbackItem[] = [
				makeMistake({ severity: 'MINOR' }),
				makeMistake({ severity: 'MODERATE' })
			];
			const filters: UserMessageReviewFilters = {
				category: 'STRENGTHS',
				searchQuery: '',
				mistakeSeverity: 'CRITICAL',
				suggestionType: 'ALL'
			};

			const result = filterUserMessageReviews(items, filters);

			expect(result).toEqual([]);
		});

		it('should not apply suggestion type filter when category is not SUGGESTIONS', () => {
			const items: AggregatedFeedbackItem[] = [
				makeSuggestion({ suggestionType: 'VOCABULARY' }),
				makeSuggestion({ suggestionType: 'STRUCTURE' })
			];
			const filters: UserMessageReviewFilters = {
				category: 'MISTAKES',
				searchQuery: '',
				mistakeSeverity: 'ALL',
				suggestionType: 'VOCABULARY'
			};

			const result = filterUserMessageReviews(items, filters);

			expect(result).toEqual([]);
		});
	});

	describe('edge cases', () => {
		it('should return empty array for empty input', () => {
			const items: AggregatedFeedbackItem[] = [];
			const filters: UserMessageReviewFilters = {
				category: 'ALL',
				searchQuery: '',
				mistakeSeverity: 'ALL',
				suggestionType: 'ALL'
			};

			const result = filterUserMessageReviews(items, filters);

			expect(result).toEqual([]);
		});

		it('should handle empty search query as no filter', () => {
			const items: AggregatedFeedbackItem[] = [makeMistake(), makeStrength()];
			const filters: UserMessageReviewFilters = {
				category: 'ALL',
				searchQuery: '',
				mistakeSeverity: 'ALL',
				suggestionType: 'ALL'
			};

			const result = filterUserMessageReviews(items, filters);

			expect(result).toHaveLength(2);
		});

		it('should handle whitespace-only search query as no filter', () => {
			const items: AggregatedFeedbackItem[] = [makeMistake(), makeStrength()];
			const filters: UserMessageReviewFilters = {
				category: 'ALL',
				searchQuery: '   ',
				mistakeSeverity: 'ALL',
				suggestionType: 'ALL'
			};

			const result = filterUserMessageReviews(items, filters);

			expect(result).toHaveLength(2);
		});

		it('should filter by partial search query match', () => {
			const items: AggregatedFeedbackItem[] = [makeMistake({ searchableText: 'hello world test' })];
			const filters: UserMessageReviewFilters = {
				category: 'ALL',
				searchQuery: 'worl',
				mistakeSeverity: 'ALL',
				suggestionType: 'ALL'
			};

			const result = filterUserMessageReviews(items, filters);

			expect(result).toHaveLength(1);
		});

		it('should handle all severity levels correctly', () => {
			const items: AggregatedFeedbackItem[] = [
				makeMistake({ severity: 'MINOR' }),
				makeMistake({ severity: 'MODERATE' }),
				makeMistake({ severity: 'CRITICAL' })
			];
			const filters: UserMessageReviewFilters = {
				category: 'MISTAKES',
				searchQuery: '',
				mistakeSeverity: 'CRITICAL',
				suggestionType: 'ALL'
			};

			const result = filterUserMessageReviews(items, filters);

			expect(result).toHaveLength(1);
			expect((result[0] as AggregatedMistake).data.severity).toBe('CRITICAL');
		});

		it('should handle all suggestion types correctly', () => {
			const items: AggregatedFeedbackItem[] = [
				makeSuggestion({ suggestionType: 'VOCABULARY' }),
				makeSuggestion({ suggestionType: 'STRUCTURE' })
			];
			const filters: UserMessageReviewFilters = {
				category: 'SUGGESTIONS',
				searchQuery: '',
				mistakeSeverity: 'ALL',
				suggestionType: 'STRUCTURE'
			};

			const result = filterUserMessageReviews(items, filters);

			expect(result).toHaveLength(1);
			expect((result[0] as AggregatedSuggestion).data.suggestionType).toBe('STRUCTURE');
		});

		it('should combine category and search filters correctly', () => {
			const items: AggregatedFeedbackItem[] = [
				makeMistake({ phrase: 'test', searchableText: 'test mistake' }),
				makeStrength({ phrase: 'test', searchableText: 'test strength' }),
				makeMistake({ phrase: 'other', searchableText: 'other mistake' })
			];
			const filters: UserMessageReviewFilters = {
				category: 'MISTAKES',
				searchQuery: 'test',
				mistakeSeverity: 'ALL',
				suggestionType: 'ALL'
			};

			const result = filterUserMessageReviews(items, filters);

			expect(result).toHaveLength(1);
			expect(result[0].type).toBe('MISTAKES');
			expect(result[0].phrase).toBe('test');
		});
	});
});
