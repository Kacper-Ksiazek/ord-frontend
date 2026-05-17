export type FormatRelativeOrMediumDateOptions = {
	/**
	 * If the instant is farther from `now` than this many 24h periods (ms/86400000),
	 * use `dateStyle: 'medium'` instead of a relative phrase.
	 * @default 14
	 */
	absoluteAfterDays?: number;
	/** BCP 47 locale(s) for `Intl`; omit for the runtime default. */
	locale?: string | string[];
	/** Reference instant; default `new Date()` */
	now?: Date;
};

function formatRelativeTime(date: Date, now: Date, locale: string | string[] | undefined): string {
	const diffSec = Math.round((date.getTime() - now.getTime()) / 1000);
	const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
	const absSec = Math.abs(diffSec);

	if (absSec < 60) {
		return rtf.format(diffSec, 'second');
	}

	const divisions: [Intl.RelativeTimeFormatUnit, number][] = [
		['year', 31536000],
		['month', 2628000],
		['week', 604800],
		['day', 86400],
		['hour', 3600],
		['minute', 60],
		['second', 1]
	];

	for (const [unit, secondsInUnit] of divisions) {
		if (absSec >= secondsInUnit || unit === 'second') {
			const delta = diffSec / secondsInUnit;

			return rtf.format(Math.round(delta), unit);
		}
	}

	return rtf.format(0, 'second');
}

/**
 * Human-readable time: relative (`Intl.RelativeTimeFormat`) when within `absoluteAfterDays`
 * of `now`, otherwise a medium-styled absolute date.
 */
export function formatRelativeOrMediumDate(
	input: string | Date | number,
	options?: FormatRelativeOrMediumDateOptions
): string {
	const { absoluteAfterDays = 14, locale, now = new Date() } = options ?? {};
	const date = input instanceof Date ? input : new Date(input);

	if (Number.isNaN(date.getTime())) {
		return typeof input === 'string' ? input : '';
	}

	const diffDays = Math.abs(now.getTime() - date.getTime()) / 86400000;

	if (diffDays > absoluteAfterDays) {
		return date.toLocaleDateString(locale, { dateStyle: 'medium' });
	}

	return formatRelativeTime(date, now, locale);
}
