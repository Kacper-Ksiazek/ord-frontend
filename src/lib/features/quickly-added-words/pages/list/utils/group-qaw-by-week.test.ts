import { describe, expect, it } from 'vitest';
import type { QuicklyAddedWordDTO } from '$lib/types/quickly-added-word';
import {
	formatQawWeekSectionLabel,
	groupQawByWeek,
	startOfIsoWeekMonday
} from './group-qaw-by-week';

function makeQaw(
	overrides: Partial<QuicklyAddedWordDTO> & Pick<QuicklyAddedWordDTO, 'id' | 'createdAt'>
): QuicklyAddedWordDTO {
	return {
		word: 'example',
		language: 'ENGLISH',
		isApproved: true,
		userId: '550e8400-e29b-41d4-a716-446655440000',
		...overrides
	};
}

describe('groupQawByWeek', () => {
	const now = new Date('2026-05-24T12:00:00');

	it('groups items into weekly sections ordered newest first', () => {
		const thisWeek = makeQaw({ id: 'a', createdAt: '2026-05-23T10:00:00.000Z' });
		const lastWeek = makeQaw({ id: 'b', createdAt: '2026-05-17T10:00:00.000Z' });
		const older = makeQaw({ id: 'c', createdAt: '2026-05-03T10:00:00.000Z' });

		const result = groupQawByWeek([older, thisWeek, lastWeek], { now });

		expect(result).toHaveLength(3);
		expect(result[0].label).toBe('This week');
		expect(result[0].items).toEqual([thisWeek]);
		expect(result[1].label).toBe('Last week');
		expect(result[1].items).toEqual([lastWeek]);
		expect(result[2].items).toEqual([older]);
	});

	it('preserves item order within the same week', () => {
		const first = makeQaw({ id: 'first', createdAt: '2026-05-23T10:00:00.000Z' });
		const second = makeQaw({ id: 'second', createdAt: '2026-05-22T10:00:00.000Z' });

		const result = groupQawByWeek([first, second], { now });

		expect(result).toEqual([
			{
				sectionKey: formatLocalYmd(startOfIsoWeekMonday(new Date('2026-05-23T10:00:00.000Z'))),
				label: 'This week',
				items: [first, second]
			}
		]);
	});

	it('returns an empty array when there are no items', () => {
		expect(groupQawByWeek([], { now })).toEqual([]);
	});

	it('skips items with invalid createdAt values', () => {
		const valid = makeQaw({ id: 'valid', createdAt: '2026-05-23T10:00:00.000Z' });
		const invalid = makeQaw({ id: 'invalid', createdAt: 'not-a-date' });

		const result = groupQawByWeek([invalid, valid], { now });

		expect(result).toHaveLength(1);
		expect(result[0].items).toEqual([valid]);
	});
});

describe('formatQawWeekSectionLabel', () => {
	const now = new Date('2026-05-24T12:00:00');

	it('labels the current week as This week', () => {
		const weekStart = startOfIsoWeekMonday(now);

		expect(formatQawWeekSectionLabel(weekStart, now)).toBe('This week');
	});

	it('labels the previous week as Last week', () => {
		const lastWeekStart = new Date(now);
		lastWeekStart.setDate(lastWeekStart.getDate() - 7);
		const weekStart = startOfIsoWeekMonday(lastWeekStart);

		expect(formatQawWeekSectionLabel(weekStart, now)).toBe('Last week');
	});

	it('labels older weeks with a date range', () => {
		const weekStart = startOfIsoWeekMonday(new Date('2026-04-14T12:00:00'));

		expect(formatQawWeekSectionLabel(weekStart, now, 'en-US')).toBe('Apr 13 – Apr 19, 2026');
	});
});

function formatLocalYmd(date: Date): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');

	return `${year}-${month}-${day}`;
}
