import type { Reporter, TestCase, TestModule } from 'vitest/reporters';

import {
	color,
	emptyTotals,
	firstLine,
	formatElapsed,
	printSummary,
	type FailedCase,
	type TestTotals
} from './terminal';

class VitestSummaryReporter implements Reporter {
	private start = 0;

	onTestRunStart(): void {
		this.start = Date.now();
		console.log(`${color('blue', 'Unit tests')} — starting...`);
	}

	onTestRunEnd(testModules: ReadonlyArray<TestModule>): void {
		const totals = emptyTotals();
		const failedCases: FailedCase[] = [];

		for (const testModule of testModules) {
			for (const test of testModule.children.allTests()) {
				this.collectTest(test, totals, failedCases);
			}
		}

		const elapsed = formatElapsed(Date.now() - this.start);
		const success = totals.failures + totals.errors === 0;
		printSummary('Unit tests', totals, failedCases, elapsed, success);
	}

	private collectTest(test: TestCase, totals: TestTotals, failedCases: FailedCase[]): void {
		totals.tests += 1;

		const result = test.result();

		switch (result.state) {
			case 'passed':
				totals.passed += 1;
				break;
			case 'skipped':
				totals.skipped += 1;
				break;
			case 'failed': {
				totals.failures += 1;
				const message = result.errors?.[0]?.message;
				failedCases.push({
					class: test.module.moduleId,
					name: test.fullName,
					kind: 'FAIL',
					message: firstLine(typeof message === 'string' ? message : undefined)
				});
				break;
			}
			default:
				break;
		}
	}
}

export default VitestSummaryReporter;
