#!/usr/bin/env python3
"""Parse Vitest or Playwright JSON reports for live progress and final summaries."""

from __future__ import annotations

import json
import os
import sys
from typing import Any


def _empty_totals() -> dict[str, int]:
    return {
        "tests": 0,
        "passed": 0,
        "failures": 0,
        "errors": 0,
        "skipped": 0,
    }


def _first_line(text: str | None, limit: int = 140) -> str:
    if not text:
        return ""
    line = text.strip().splitlines()[0] if text.strip() else ""
    if len(line) > limit:
        return line[: limit - 3] + "..."
    return line


def parse_vitest_report(path: str) -> dict[str, Any]:
    totals = _empty_totals()
    failed_cases: list[dict[str, str]] = []

    if not os.path.isfile(path):
        return {"totals": totals, "failed_cases": failed_cases}

    try:
        with open(path, encoding="utf-8") as handle:
            data = json.load(handle)
    except (OSError, json.JSONDecodeError):
        return {"totals": totals, "failed_cases": failed_cases}

    for suite in data.get("testResults", []):
        suite_name = suite.get("name", "?")
        for assertion in suite.get("assertionResults", []):
            totals["tests"] += 1
            name = assertion.get("title", assertion.get("fullName", "?"))
            status = assertion.get("status", "failed")

            if status == "passed":
                totals["passed"] += 1
            elif status in {"skipped", "pending", "todo"}:
                totals["skipped"] += 1
            else:
                totals["failures"] += 1
                failed_cases.append(
                    {
                        "class": suite_name,
                        "name": name,
                        "kind": "FAIL",
                        "message": _first_line(assertion.get("failureMessages", [""])[0]),
                    }
                )

    return {"totals": totals, "failed_cases": failed_cases}


def _walk_playwright_suites(
    suites: list[dict[str, Any]],
    prefix: str,
    totals: dict[str, int],
    failed_cases: list[dict[str, str]],
) -> None:
    for suite in suites:
        title = suite.get("title", "")
        next_prefix = f"{prefix} › {title}" if prefix else title

        for spec in suite.get("specs", []):
            spec_title = spec.get("title", "?")
            class_name = f"{next_prefix} › {spec_title}" if next_prefix else spec_title

            for test in spec.get("tests", []):
                for result in test.get("results", []):
                    totals["tests"] += 1
                    status = result.get("status", "failed")

                    if status == "passed":
                        totals["passed"] += 1
                    elif status in {"skipped", "interrupted"}:
                        totals["skipped"] += 1
                    elif status == "timedOut":
                        totals["errors"] += 1
                        failed_cases.append(
                            {
                                "class": class_name,
                                "name": test.get("title", spec_title),
                                "kind": "TIMEOUT",
                                "message": _first_line(result.get("error", {}).get("message")),
                            }
                        )
                    else:
                        totals["failures"] += 1
                        failed_cases.append(
                            {
                                "class": class_name,
                                "name": test.get("title", spec_title),
                                "kind": "FAIL",
                                "message": _first_line(result.get("error", {}).get("message")),
                            }
                        )

        _walk_playwright_suites(suite.get("suites", []), next_prefix, totals, failed_cases)


def parse_playwright_report(path: str) -> dict[str, Any]:
    totals = _empty_totals()
    failed_cases: list[dict[str, str]] = []

    if not os.path.isfile(path):
        return {"totals": totals, "failed_cases": failed_cases}

    try:
        with open(path, encoding="utf-8") as handle:
            data = json.load(handle)
    except (OSError, json.JSONDecodeError):
        return {"totals": totals, "failed_cases": failed_cases}

    _walk_playwright_suites(data.get("suites", []), "", totals, failed_cases)
    return {"totals": totals, "failed_cases": failed_cases}


def main() -> int:
    if len(sys.argv) != 3:
        print("Usage: test-report-parser.py <vitest|playwright> <report-json-path>", file=sys.stderr)
        return 2

    kind, path = sys.argv[1], sys.argv[2]
    if kind == "vitest":
        payload = parse_vitest_report(path)
    elif kind == "playwright":
        payload = parse_playwright_report(path)
    else:
        print("Kind must be vitest or playwright", file=sys.stderr)
        return 2

    print(json.dumps(payload))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
