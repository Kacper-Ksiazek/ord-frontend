import { describe, expect, it } from 'vitest';
import { buildEmptyHomeResponse } from './home-empty-response';

describe('buildEmptyHomeResponse', () => {
	it('should return zeroed counts and 90-day zero trends', () => {
		const home = buildEmptyHomeResponse(new Date('2026-06-15T12:00:00.000Z'));

		expect(home.words.total).toBe(0);
		expect(home.words.byType).toEqual({});
		expect(home.conversations.total).toBe(0);
		expect(home.games.comingSoon).toBe(true);
		expect(home.activity.year).toBe(2026);
		expect(home.activity.days).toEqual([]);
		expect(home.recentWords).toEqual([]);
		expect(home.recentConversations).toEqual([]);
		expect(home.trends.wordsAdded).toHaveLength(90);
		expect(home.trends.wordsAdded.every((day) => day.count === 0)).toBe(true);
	});
});
