import { describe, expect, it } from 'vitest';
import { buildEmptyHomeActivity, buildEmptyHomeResponse } from './home-empty-response';

describe('buildEmptyHomeResponse', () => {
	it('should return zeroed counts and 90-day zero trends', () => {
		const home = buildEmptyHomeResponse();

		expect(home.overviews.words.total).toBe(0);
		expect(home.overviews.words.byType).toEqual({});
		expect(home.overviews.conversations.total).toBe(0);
		expect(home.overviews.games.comingSoon).toBe(true);
		expect(home.recentContent.words).toEqual([]);
		expect(home.recentContent.conversations).toEqual([]);
		expect(home.overviews.words.trend).toHaveLength(90);
		expect(home.overviews.words.trend.every((day) => day.count === 0)).toBe(true);
	});

	it('should return an empty year for the activity endpoint', () => {
		const activity = buildEmptyHomeActivity(new Date('2026-06-15T12:00:00.000Z'));

		expect(activity.year).toBe(2026);
		expect(activity.days).toEqual([]);
	});
});
