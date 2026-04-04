export type FormatDateDayMonthYearTimeOptions = {
	/** BCP 47 locale(s) for `Intl`; omit for the runtime default. */
	locale?: string | string[];
};

/**
 * Formats an instant as a medium-style date plus time in 24-hour clock (locale-aware date parts).
 * Uses the runtime local timezone.
 */
export function formatDateDayMonthYearTime(
	input: string | Date | number,
	options?: FormatDateDayMonthYearTimeOptions
): string {
	const date = input instanceof Date ? input : new Date(input);

	if (Number.isNaN(date.getTime())) {
		return typeof input === 'string' ? input : '';
	}

	return new Intl.DateTimeFormat(options?.locale, {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	}).format(date);
}
