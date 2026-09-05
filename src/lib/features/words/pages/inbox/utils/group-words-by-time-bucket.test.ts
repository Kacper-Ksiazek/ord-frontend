import { describe, expect, it } from 'vitest';
import { getTimeBucket, groupWordsByTimeBucket } from './group-words-by-time-bucket';

describe('getTimeBucket', () => {
	const now = new Date('2026-09-05T15:00:00');

	it('returns today for items created today', () => {
		expect(getTimeBucket(new Date('2026-09-05T08:00:00'), now)).toBe('today');
	});

	it('returns yesterday for items created yesterday', () => {
		expect(getTimeBucket(new Date('2026-09-04T20:00:00'), now)).toBe('yesterday');
	});

	it('returns this_week for items earlier in the same week', () => {
		expect(getTimeBucket(new Date('2026-09-01T12:00:00'), now)).toBe('this_week');
	});

	it('returns last_week for items from the previous week', () => {
		expect(getTimeBucket(new Date('2026-08-30T12:00:00'), now)).toBe('last_week');
	});

	it('returns earlier for older items', () => {
		expect(getTimeBucket(new Date('2026-07-01T12:00:00'), now)).toBe('earlier');
	});
});

describe('groupWordsByTimeBucket', () => {
	it('groups items in bucket order and skips empty buckets', () => {
		const groups = groupWordsByTimeBucket(
			[
				{ id: '1', createdAt: '2026-09-05T10:00:00Z' },
				{ id: '2', createdAt: '2026-09-04T10:00:00Z' },
				{ id: '3', createdAt: '2026-09-01T10:00:00Z' }
			],
			new Date('2026-09-05T15:00:00')
		);

		expect(groups.map((group) => group.bucket)).toEqual(['today', 'yesterday', 'this_week']);
		expect(groups[0]?.items.map((item) => item.id)).toEqual(['1']);
	});
});
