# FloodAid Systems — Code Review

Review date: 15 October 2026

## Executive finding

This repository is more than a static mockup: the interface runs real deterministic planning arithmetic and a seeded Monte Carlo service-level simulation. However, it is not yet a live optimization or machine-learning application. The six network plans are stored as precomputed values in `src/data/network.ts`; the front end scales and displays those values instead of solving a new optimization problem when a user changes an input.

**Accurate current description:** an interactive scenario dashboard / decision-support prototype using precomputed network-plan results and a Monte Carlo service-level sensitivity model.

## Capability audit

| Capability | Current implementation | Assessment |
|---|---|---|
| Scenario and network comparison | Selects one of six embedded tables: north, south, stochastic, each with base/flexible versions | Implemented, but plans are precomputed |
| Cash/physical mix and local/import split | Arithmetic derived from selected table and interface controls | Implemented as rules, not re-optimized |
| Gateway and divisional-DC flows | Displays embedded flow values, scaled for selected physical share | Implemented as a visualization of fixed allocations |
| Service-level uncertainty | Seeded two-bucket Monte Carlo simulation of demand shocks and largest-gateway stress | Implemented as a simulation/surrogate, not an optimizer |
| Solver / MILP | No solver package, solver API, LP/MPS generation, objective function or decision-variable search was found in the application code | Not implemented in the app runtime |
| Clustering | `ceil(affected people / cluster size)` reports a count per district | Count estimate only; no clustering algorithm, household assignment, centroids or routes |
| Inter-agency zoning | Greedy balancing of division-level population across three agency labels; display toggle hides/shows the labels | Heuristic placeholder; not a spatial overlap/exclusion model |
| Forecasting / machine learning | No trained model, inference code or training pipeline found | Not implemented |
| Live hydrology / market data | No operational data connector used by the planning desk; scenario values are hard-coded | Not implemented |

The Excel workbooks and presentation in `attachments/` are included as source materials, but the runtime planning code reads the TypeScript data tables, not the workbooks.

## Fixes applied in this review copy

1. The service panel now requests 10,000 Monte Carlo replications, and the simulation function accepts up to 10,000 instead of silently capping runs at 4,000.
2. The histogram tooltip now describes the actual ranges. The first bar explicitly notes that it combines all fill rates below 73%, including values below 70%; later bars show their 3-percentage-point ranges.
3. Removed a duplicated, unreachable `scenario === "south"` branch.
4. Added `src/lib/planning.test.ts` and wired it into the package test command. Tests check all six embedded plan tables, district demand versus divisional-flow totals, scenario calculation totals, Monte Carlo reproducibility, and histogram counts.
5. Changed the planning module's data import to a relative TypeScript import so its pure logic can be exercised by Node's TypeScript-stripping test runner as well as the app bundler.

## Validation performed

- The three new planning tests passed using Node 22's built-in test runner.
- The planning/data modules also passed a targeted TypeScript type-check with strict mode enabled.
- The six plan tables contain all 64 districts. For every embedded district record, demand and divisional-flow totals matched within 0.05 tonnes, consistent with workbook rounding.
- Across the tested scenario/network/cyclone combinations, district physical tonnes and gateway-import totals reconciled within the same tolerance.
- A 10,000-run simulation was executed and returned a histogram whose bucket counts summed to 10,000.

## Validation not completed

A full install/build/browser check could not be completed in this environment: `npm ci --ignore-scripts` timed out, and the global TypeScript check stopped because installed type definitions for `node` and `vite/client` were unavailable. The modified files therefore passed the targeted runtime tests, but the full app has not been verified by a Vite production build or browser QA in this review.

## Recommended next engineering steps

1. Define the optimization model explicitly: decision variables, fixed/open facility choices, capacity constraints, demand coverage, cost/emissions terms, resilience scenarios, and the objective. Then call a real MILP solver (server-side or via a solver service) whenever relevant inputs change.
2. Implement actual clustering and assignment: specify whether the clusters are geographic, population-weighted, travel-time-constrained or household-level; return member assignments and measurable cluster statistics rather than only a count.
3. Replace the zoning proxy with a geospatial allocation/coverage model that can calculate duplicate service and uncovered population from explicit agency coverage data.
4. Treat the current Monte Carlo component as a sensitivity experiment. Document its distributional assumptions, validate/calibrate them against data, and connect disruption assumptions to the capacity model before presenting it as an operational service-level guarantee.
5. Add live-data connectors only after defining the source, update cadence, outage handling, and fallback behavior.
