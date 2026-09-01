# TanStack Charts

Charts use [@tanstack/charts](https://tanstack.com/charts/latest) (pre-alpha; pin version in
`package.json`). Do not add ApexCharts or Flowbite chart wrappers.

## Where code lives

- `$lib/components/charts/chart-theme.ts` — Quiet studio colors, margins
- `$lib/components/charts/tanstack-chart/` — thin `TanStackChart` wrapper around `Chart` from
  `@tanstack/charts/svelte`
- Feature charts: `defineChart` + marks (`lineY`, `ruleY`, `pie`, `radialArc`, `areaY`) in
  `$derived.by()` definitions

## Conventions

- Reactive definitions: build marks in `$derived.by()`; avoid destroy/recreate patterns.
- Colors: `getChartPrimaryLine()`, `getChartInkMuted()`, score/severity tokens from chart-theme or
  feature constants — not hard-coded grays.
- Compact charts in summary panel (e.g. verdict trend ~120px); full-size only when the chart is the
  main content of a section.
- `pie()` options: do not pass invalid keys (e.g. `key` is not in `PieOptions` in current API).

## Good

```svelte
const definition = $derived.by(() =>
  defineChart({
    marks: [lineY(rows, { x: 'label', y: 'value', stroke: getChartPrimaryLine() })],
    x: { scale: () => scalePoint().padding(0.35) },
    y: { scale: () => scaleLinear().domain([0, 10]).nice(), grid: true }
  })
);
```

## Bad

```svelte
<!-- Apex / remount-on-options-change -->
<ApexChart {options} />
```
