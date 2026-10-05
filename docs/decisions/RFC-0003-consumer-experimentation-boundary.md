# RFC-0003 — Consumer experimentation boundary

Status: **Proposed**
Tracks: #29

## Decision under review

Phyllotaxis should support consumer A/B and multivariate presentation experiments through its existing semantic extension points rather than through a new experimentation runtime.

The proposed ownership model is:

- Chroma supplies stable semantic values.
- Venation supplies stable layout relationships.
- Lamina supplies reusable semantics.
- The consuming application owns experiment assignment, measurement, persistence, and cleanup.

No new runtime export is proposed.

## Profiles and experiment variants

The accepted visual profiles remain `utility` and `editorial`. They describe user-task and content semantics, not experiment buckets.

Experiment identifiers and variant names therefore remain consumer-owned. Values such as `pastel` or `variant-b` must not be added to `data-phyllotaxis-profile`.

## Visual experiments

The primary visual experimentation seam is the public Chroma custom-property surface.

A consumer may load a local stylesheet after Phyllotaxis and override stable `--phyllotaxis-*` values for a coherent experiment surface. The local experiment must not depend on internal `--pt-*` values and does not become a new Phyllotaxis profile merely because it performs well.

Example:

```css
[data-ui-variant="pastel"] {
  --phyllotaxis-color-surface: #f4f1fb;
  --phyllotaxis-color-border: #b8afca;
}
```

The `data-ui-variant` attribute above is illustrative consumer markup, not Phyllotaxis API.

## Layout and semantic experiments

A consumer may compare different host compositions of stable Venation primitives or existing Lamina semantics.

Venation and Lamina must remain free of experiment-specific props, bucket identifiers, and branches. Reusable findings enter the normal Phyllotaxis design process instead of being preserved as permanent experiment paths.

## Assignment and measurement

Phyllotaxis does not own assignment, analytics, experiment statistics, or persistence.

Where a host uses stable assignment, it should prefer deterministic selection and render the selected variant before first paint where practical so visual switching does not distort either experience or measurement.

Experiment lifecycle should be bounded: start, measure, decide, remove losing branches, and retain only the evidence needed for the resulting decision.

## Deterministic validation still applies

A/B testing complements normal conformance testing; it does not replace it.

| Property | Evidence |
| --- | --- |
| local behavior | unit/component tests |
| public API compatibility | contract tests |
| unintended visual changes | visual regression |
| semantics and interaction accessibility | accessibility checks |
| responsive/interaction behavior | component or end-to-end tests |
| rendering/payload cost | performance checks |
| product outcome difference | A/B or multivariate experiment |

Each experimental variant must independently satisfy the same applicable accessibility, functional, responsive, and performance requirements.

A useful visual-fixture model is:

```text
profile × experiment-variant × scheme × viewport × state
```

Coverage should remain risk-shaped rather than exhaustively Cartesian.

## First reference experiment

The current community-site question is a suitable first experiment.

**A — strict Utility**

- Utility profile;
- minimal Craigslist-like treatment;
- existing layout and semantic contracts.

**B — Utility with bounded pastel surfaces**

- same Utility profile;
- same task and semantics;
- local overrides to a small set of Chroma surface/border roles;
- no new `pastel` Phyllotaxis profile.

This isolates visual treatment rather than changing several architectural dimensions at once.

## Promotion rule

A winning experiment has three possible dispositions:

1. remain consumer-owned when it is product-specific;
2. become evidence for QART/RFC/ADR work when it reveals a reusable Phyllotaxis need;
3. be removed when the result is not useful.

Experiment success does not silently expand the public Phyllotaxis contract.

## Public API impact

No `Variant`, `ExperimentProvider`, feature-flag adapter, analytics hook, or runtime registry is proposed.

A first-class variant abstraction should be reconsidered only after repeated consumer evidence identifies a problem that the existing host-owned seam cannot solve.

## Acceptance before ADR

- [ ] profiles remain semantic and distinct from experiment buckets;
- [ ] public Chroma values are the preferred visual experimentation seam;
- [ ] host assignment and measurement ownership is explicit;
- [ ] Venation and Lamina remain experiment-neutral;
- [ ] each variant passes applicable deterministic validation;
- [ ] the Utility-versus-pastel reference experiment requires no new runtime API.

## Non-goals

- selecting analytics or feature-flag vendors;
- defining statistical-significance policy;
- creating an experiment dashboard;
- creating arbitrary per-component themes;
- changing Utility/Editorial semantics;
- replacing Micrantha testing standards or Testule.
