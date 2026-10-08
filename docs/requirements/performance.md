# PERF-001 — Reproducible design-system performance evidence

Status: **Proposed**. This is a measurement requirement, not an accepted numerical budget or a released capability.

## Purpose

Phyllotaxis adoption must be measurable against a functionally and semantically equivalent minimal-CSS baseline. Report absolute measurements and paired deltas, rather than interpreting an aggregate Lighthouse score as proof of conformance.

## Ownership and boundaries

This public requirement specifies observable evidence, methodology, and eventual adoption gates. `hackelia-micrantha/phyllotaxis` owns private fixture implementation, test execution, artifact generation, and CI. Consumer projects own deployment, telemetry, traffic, experiment assignment, and real-user monitoring. No tracking SDK, runtime experiment framework, or client JavaScript is introduced by this requirement.

## Measurement dimensions

1. **Artifact:** emitted CSS/JS bytes (raw, gzip, Brotli); CSS rule count and generated selector growth; whether core CSS usage requires client JavaScript.
2. **Build:** cold and incremental generation/build latency, recording toolchain/version and execution host.
3. **Browser:** style recalculation, layout, paint, composite, long tasks, heap when relevant; collect repeat runs for distributions rather than one-off samples.
4. **User-visible:** LCP, CLS, FCP and INP where sufficient genuine interactions are available. Lab tests without real interactions must not report fabricated INP; use a defined interaction trace and event timings instead.
5. **Motion and theme:** hover/focus/active states, large card collections, theme switching, reduced-motion and resize/text scaling. Identify layout/paint-inducing effects and unexpected transitions.

## Fixture contract

- Maintain two variants with identical semantic DOM, assets, content, states, viewport and input sequence: a minimal functional baseline and a Phyllotaxis version.
- Verify and report fixture comparability before interpreting paired deltas: inspect representative element rectangles, typography and computed layout styles across both variants, identify mismatches, and keep measurement diagnostics separate from any claim of complete paint or interaction equivalence.
- Representative fixtures: marketing/community, editorial/article, dense Venation primitives, card/pill interactions, light/dark/System and reduced-motion.
- Record browser and OS versions, CPU throttling, viewport, warm-up, asset/cache state, source revision, public contract pin, artifact identity, repetitions, median and dispersion. Distinguish the reviewed PR head from an Actions synthetic-merge checkout SHA when both exist; identify the actual measured commit and digests of each CSS/JS variant.
- Keep baseline and Phyllotaxis results paired in the same controlled environment. Measure absolute cost as well as delta; record the pairing/order, per-pair deltas and outlier observations without silently discarding samples. Repeat across independent sessions before recommending numerical budgets.
- Provide machine-readable summary plus human-readable report and trace links; do not include secrets, private topology or unredacted end-user interaction data in public artifacts.

## Gates and interpretation

- **PR checks:** deterministic emitted-size and growth evidence, plus baseline fixture syntax/build and comparability smoke checks. Without reviewed numerical budgets, report rather than fail on size or timing growth; avoid environment-sensitive browser timing as an unconditional merge gate. A deterministic fixture-parity failure can block acceptance of the measurement itself.
- **Release qualification:** repeatable browser traces and a documented assessment of regressions with conservative thresholds informed by baseline evidence.
- **Consumer qualification:** assess performance in the real consumer against its pre-adoption build; each A/B variant independently satisfies applicable performance and accessibility requirements.
- Numeric payload limits, timing deltas and regression tolerances are **TBD** pending initial measurements and design review; no invented budgets.
- Aggregate Lighthouse scores alone do not confer conformance. An isolated lab run does not establish field INP. A low-cost CSS library cannot claim zero runtime cost.

## Acceptance for PERF-001 design

- [ ] Measurement dimensions, paired baseline, fixture matrix, reproducibility metadata and evidence format are reviewed.
- [ ] Performance expectations remain compatible with accessibility, reduced motion, Chroma, Venation, Lamina, and host-owned A/B testing.
- [ ] Evidence supports setting future budgets without retroactively claiming numbers were already accepted.
- [ ] Implementation delivery in the private repo demonstrates at least one paired fixture and recorded trace before hard release gating.

Related: public ADR-0002 (consumer experimentation), private consumer adoption #57 and pre-stage artifact evidence #66.
