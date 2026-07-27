import path from 'node:path';

import type {
	FullConfig,
	FullResult,
	Reporter,
	Suite,
	TestCase,
	TestResult
} from '@playwright/test/reporter';

import {
	color,
	emptyTotals,
	firstLine,
	formatElapsed,
	paint,
	printSummary,
	type FailedCase,
	type TestTotals
} from './terminal';

const FLOWS_MARKER = `${path.sep}e2e${path.sep}flows${path.sep}`;
const INDENT = {
	file: '',
	describe: '    ',
	test: '      ',
	describeTotal: '    └ ',
	fileTotal: '  ─ '
} as const;

class PlaywrightReporter implements Reporter {
	private totalTests = 0;
	private currentFile = '';
	private currentDescribe: string | null = null;
	private describeDurationMs = 0;
	private fileDurationMs = 0;
	private describeCountInFile = 0;
	private isFirstFile = true;
	private readonly totals: TestTotals = emptyTotals();
	private readonly failedCases: FailedCase[] = [];

	onBegin(_config: FullConfig, suite: Suite): void {
		this.totalTests = suite.allTests().length;
		console.log(`${color('cyan', 'E2E tests')} — ${this.totalTests} tests`);
		console.log();
	}

	onTestEnd(test: TestCase, result: TestResult): void {
		this.printGroupedResult(test, result);
		this.collectResult(test, result);
	}

	onEnd(result: FullResult): void {
		this.flushDescribeTotal();
		this.flushFileTotal();

		const elapsed = formatElapsed(result.duration);
		const success = this.totals.failures + this.totals.errors === 0 && result.status === 'passed';
		printSummary('E2E tests', this.totals, this.failedCases, elapsed, success);
	}

	printsToStdio(): boolean {
		return true;
	}

	private printGroupedResult(test: TestCase, result: TestResult): void {
		const file = relativeSpecFile(test.location?.file ?? '');
		const { describe, name } = parseTestParts(test);

		if (file !== this.currentFile) {
			if (this.currentFile) {
				this.flushDescribeTotal();
				this.flushFileTotal();
			}

			this.printFileHeader(file);
			this.currentFile = file;
			this.describeCountInFile = 0;
		} else if (describe !== this.currentDescribe) {
			this.flushDescribeTotal();
		}

		if (describe !== this.currentDescribe) {
			this.currentDescribe = describe;

			if (describe) {
				this.describeCountInFile += 1;
				console.log(`${INDENT.describe}${paint(describe, 'yellow', 'bold')}`);
			}
		}

		const testIndent = describe ? INDENT.test : INDENT.describe;
		const icon = statusIcon(result.status);
		const duration = color('dim', `(${formatTestDuration(result.duration)})`);

		console.log(`${testIndent}${icon} ${color('dim', name)} ${duration}`);

		if (result.status === 'failed' || result.status === 'timedOut') {
			const message = firstLine(result.error?.message);

			if (message) {
				console.log(`${testIndent}  ${color('dim', message)}`);
			}
		}

		this.describeDurationMs += result.duration;
		this.fileDurationMs += result.duration;
	}

	private printFileHeader(file: string): void {
		if (!this.isFirstFile) {
			console.log(color('dim', '  ──────────────────────────────────────────────────────────'));
		}

		this.isFirstFile = false;
		console.log(`${INDENT.file}${paint(`▌ ${file}`, 'cyan', 'bold')}`);
	}

	private flushDescribeTotal(): void {
		if (this.currentDescribe === null) {
			return;
		}

		console.log(
			`${INDENT.describeTotal}${color('dim', formatTestDuration(this.describeDurationMs))}`
		);
		this.currentDescribe = null;
		this.describeDurationMs = 0;
	}

	private flushFileTotal(): void {
		if (!this.currentFile) {
			return;
		}

		if (this.describeCountInFile > 1 || this.describeCountInFile === 0) {
			console.log(
				`${INDENT.fileTotal}${color('dim', `total ${formatTestDuration(this.fileDurationMs)}`)}`
			);
		}

		console.log();
		this.fileDurationMs = 0;
		this.describeCountInFile = 0;
	}

	private collectResult(test: TestCase, result: TestResult): void {
		this.totals.tests += 1;

		switch (result.status) {
			case 'passed':
				this.totals.passed += 1;
				break;
			case 'skipped':
			case 'interrupted':
				this.totals.skipped += 1;
				break;
			case 'timedOut':
				this.totals.errors += 1;
				this.failedCases.push(this.toFailedCase(test, 'TIMEOUT', result.error?.message));
				break;
			default:
				this.totals.failures += 1;
				this.failedCases.push(this.toFailedCase(test, 'FAIL', result.error?.message));
		}
	}

	private toFailedCase(test: TestCase, kind: FailedCase['kind'], message?: string): FailedCase {
		const { describe, name } = parseTestParts(test);
		const label = describe ? `${describe} › ${name}` : name;

		return {
			class: relativeSpecFile(test.location?.file ?? ''),
			name: label,
			kind,
			message: firstLine(message)
		};
	}
}

function relativeSpecFile(filePath: string): string {
	const markerIndex = filePath.indexOf(FLOWS_MARKER);

	if (markerIndex >= 0) {
		return filePath.slice(markerIndex + FLOWS_MARKER.length);
	}

	return path.basename(filePath);
}

function parseTestParts(test: TestCase): { describe: string | null; name: string } {
	const parts = test.titlePath().filter((part) => part && part !== ' ');
	const fileIndex = parts.findIndex((part) => part.includes('.spec.ts'));
	const labels = fileIndex >= 0 ? parts.slice(fileIndex + 1) : parts;

	if (labels.length === 0) {
		return { describe: null, name: test.title };
	}

	if (labels.length === 1) {
		return { describe: null, name: labels[0] };
	}

	return {
		describe: labels.slice(0, -1).join(' › '),
		name: labels[labels.length - 1] ?? test.title
	};
}

function statusIcon(status: TestResult['status']): string {
	switch (status) {
		case 'passed':
			return color('green', '✓');
		case 'skipped':
		case 'interrupted':
			return color('yellow', '○');
		case 'timedOut':
			return color('red', '✘');
		default:
			return color('red', '✘');
	}
}

function formatTestDuration(ms: number): string {
	if (ms < 1000) {
		return `${ms}ms`;
	}

	return `${(ms / 1000).toFixed(1)}s`;
}

export default PlaywrightReporter;
