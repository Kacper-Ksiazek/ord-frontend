export interface TestTotals {
	tests: number;
	passed: number;
	failures: number;
	errors: number;
	skipped: number;
}

export interface FailedCase {
	class: string;
	name: string;
	kind: 'FAIL' | 'TIMEOUT' | 'ERROR';
	message: string;
}

export function isColorEnabled(): boolean {
	return Boolean(process.stdout.isTTY && !process.env.NO_COLOR);
}

// Palette tuned for light terminals: avoid \x1b[2m (faint) and pale cyan/yellow on white.
// Bold + standard/dark ANSI colors stay readable on dark terminals too.
const ANSI: Record<string, string> = {
	reset: '\x1b[0m',
	bold: '\x1b[1m',
	/** Secondary text — dark gray on light bg (not faint/light gray). */
	muted: '\x1b[90m',
	dim: '\x1b[90m',
	red: '\x1b[1;31m',
	green: '\x1b[1;32m',
	yellow: '\x1b[1;33m',
	blue: '\x1b[1;34m',
	magenta: '\x1b[1;35m',
	cyan: '\x1b[1;34m'
};

export function color(name: keyof typeof ANSI, text: string): string {
	if (!isColorEnabled()) {
		return text;
	}

	return `${ANSI[name]}${text}${ANSI.reset}`;
}

export function paint(text: string, ...styles: (keyof typeof ANSI)[]): string {
	if (!isColorEnabled()) {
		return text;
	}

	const open = styles.map((style) => ANSI[style]).join('');

	return `${open}${text}${ANSI.reset}`;
}

export function formatElapsed(ms: number): string {
	const totalSeconds = Math.floor(ms / 1000);
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;

	return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function firstLine(text: string | undefined, limit = 140): string {
	if (!text?.trim()) {
		return '';
	}

	const line = text.trim().split('\n')[0] ?? '';

	return line.length > limit ? `${line.slice(0, limit - 3)}...` : line;
}

export function emptyTotals(): TestTotals {
	return { tests: 0, passed: 0, failures: 0, errors: 0, skipped: 0 };
}

export function printSummary(
	label: string,
	totals: TestTotals,
	failedCases: FailedCase[],
	elapsed: string,
	success: boolean
): void {
	console.log();
	console.log(`${color('dim', '='.repeat(60))}`);
	console.log(`  ${color('bold', String(totals.tests))} tests in ${color('blue', elapsed)}`);
	console.log(`${color('dim', '='.repeat(60))}`);
	console.log(`  Passed:  ${color('green', String(totals.passed))}`);
	console.log(
		`  Failed:  ${totals.failures ? color('red', String(totals.failures)) : String(totals.failures)}`
	);
	console.log(
		`  Errors:  ${totals.errors ? color('red', String(totals.errors)) : String(totals.errors)}`
	);
	console.log(
		`  Skipped: ${totals.skipped ? color('yellow', String(totals.skipped)) : String(totals.skipped)}`
	);
	console.log();

	if (failedCases.length > 0) {
		console.log(paint(`Failed tests (${failedCases.length}):`, 'red'));
		console.log(color('muted', '-'.repeat(60)));

		for (const failedCase of failedCases) {
			const kindColor =
				failedCase.kind === 'TIMEOUT'
					? color('yellow', `[${failedCase.kind}]`)
					: color('red', `[${failedCase.kind}]`);
			console.log(`  ${kindColor} ${paint(failedCase.class, 'bold')}`);
			console.log(`         ${failedCase.name}`);

			if (failedCase.message) {
				console.log(`         ${color('muted', failedCase.message)}`);
			}

			console.log();
		}
	}

	if (success) {
		console.log(paint('All tests passed.', 'green'));
	} else {
		console.log(paint('Result: FAILED', 'red'));
	}

	console.log();
}
