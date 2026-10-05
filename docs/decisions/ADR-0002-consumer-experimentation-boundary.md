# ADR-0002 — Keep Phyllotaxis experimentation host-owned

- **Status:** Accepted
- **Date:** 2026-10-04
- **Decision owners:** Phyllotaxis public contract authority
- **Scope:** Consumer experimentation and validation across Phyllotaxis-based web surfaces
- **Supersedes:** None
- **Superseded by:** None

## Context

Phyllotaxis needs to support A/B, multivariate, and related presentation experiments without turning temporary product variants into stable design-system semantics.

The accepted architecture already separates concerns:

- Chroma owns semantic visual values;
- Venation owns layout relationships;
- Lamina owns reusable semantics;
- Utility and Editorial are semantic visual profiles selected by task/content.

QART-0003 compared four approaches: leaving experimentation unspecified, using existing Phyllotaxis seams with host-owned lifecycle, introducing a first-class runtime Variant/Experiment API, and representing experiment variants as additional visual profiles.

RFC-0003 developed the recommended host-owned boundary and was reviewed against repository policy, color-scheme/accessibility behavior, testing requirements, and the public-design/private-implementation split.

## Decision

Phyllotaxis experimentation remains **host-owned**.

Consumers may run A/B or multivariate experiments through existing public Phyllotaxis contracts, but Phyllotaxis itself does not own variant assignment, persistence, analytics, statistical evaluation, or experiment lifecycle.

Normative boundary:

1. **Profiles remain semantic.** `utility` and `editorial` are not experiment buckets. Consumer experiment names must not be added to `data-phyllotaxis-profile`.
2. **Chroma is the primary visual experimentation seam.** Consumers may override stable public `--phyllotaxis-*` semantic roles at coherent consumer-owned surfaces. Internal `--pt-*` helpers are not valid experiment dependencies.
3. **Venation remains experiment-neutral.** Consumers may compare host compositions of stable primitives, but Venation does not gain experiment-specific props, branches, or bucket state.
4. **Lamina remains experiment-neutral.** Consumers may compare existing semantic compositions or trial consumer-local semantics, but experiment-only branches do not become Lamina API.
5. **Assignment and measurement remain host responsibilities.** Stable experiments should use deterministic assignment when required and render the selected variant before first paint where practical.
6. **Experiment state is not authorization.** Client-visible bucket state is user-modifiable and cannot protect privileged content, entitlements, or security-sensitive behavior.
7. **Every variant independently satisfies conformance requirements.** Accessibility, functional, responsive, security/privacy, and applicable performance requirements remain mandatory for all variants.
8. **Experiment outcomes are evidence, not contract changes.** Reusable findings enter normal QART/RFC/ADR promotion before changing Phyllotaxis public semantics.
9. **Experiment branches are temporary.** Losing or inconclusive branches and stale instrumentation should be removed after the decision.

No new runtime/package export is introduced by this decision.

## Alternatives considered

### Leave experimentation unspecified

Benefit: no new public design work.

Not selected because ad hoc consumer experiments could misuse profile values, depend on internal CSS helpers, create permanent experiment branches, or silently bypass conformance expectations.

### First-class Phyllotaxis Variant/Experiment API

Benefit: a common runtime abstraction across consumers.

Not selected because current evidence does not require it, and it would introduce state/lifecycle responsibilities outside Phyllotaxis's current CSS/server-rendered architecture while risking a generic theme/feature-flag framework.

### Represent experiments as new visual profiles

Benefit: mechanically reuses the existing profile carrier.

Not selected because profiles have semantic task/content meaning and are intentionally bounded. Experiment names are provisional product state, not stable design-system semantics.

## Consequences

### Positive

- Consumers can experiment without forking Phyllotaxis or expanding its runtime.
- Existing public Chroma/Venation/Lamina contracts remain the authoritative design seams.
- Product experimentation stays compatible with server rendering and CSS-first profile resolution.
- Successful experiments produce evidence without silently expanding the public API.
- Security/privacy ownership remains with the consuming product that owns user state and telemetry.

### Negative and accepted costs

- Consumers need their own assignment/feature-flag mechanism when persistent bucketing is required.
- Consumers own experiment cleanup and instrumentation lifecycle.
- Some layout/semantic experiments require host composition changes rather than value-only overrides.
- There is no central Phyllotaxis experiment dashboard or runtime registry.

### Security and privacy

- Experiment assignment must never be treated as authorization.
- Sensitive targeting attributes must not be exposed through DOM or telemetry merely for experimentation.
- Identifier and telemetry collection should be minimized to the measurement need.
- Every variant preserves the same security and privacy guarantees as the non-experimental product path.

### Operations and ownership

- The consuming application owns experiment state, measurement, rollout, cleanup, and product-level incident handling.
- Phyllotaxis owns only its published design-system contracts and conformance expectations.
- Winning product-specific treatments may remain local indefinitely.

### Compatibility, migration, and rollback

- Existing consumers require no runtime migration because this ADR adds no package API.
- Experiments using stable public Chroma roles remain compatible with current profile semantics.
- A consumer rollback is removal of the experiment override/composition and restoration of the prior product state.
- A reusable contract change still follows normal versioning and migration rules separately.

### Validation

Use the lowest trustworthy layer for each property:

- unit/component tests for local behavior;
- contract tests for public interface compatibility;
- visual regression for unintended presentation changes;
- accessibility checks for semantic, keyboard, focus, and contrast properties;
- component/system/end-to-end tests for responsive and interaction behavior;
- performance checks where payload/rendering budgets are affected;
- A/B or multivariate experiments only for product-outcome comparison among otherwise conforming variants.

Visual fixtures may use the dimensions:

```text
profile × experiment-variant × scheme × viewport × state
```

Coverage remains risk-shaped rather than exhaustively Cartesian.

## Expected outcomes and review

- **Expected observable consequences:** consumers can run bounded experiments without adding Phyllotaxis profile values or runtime APIs; reusable findings arrive as explicit design proposals rather than accidental contract drift.
- **Material assumptions:** stable public Chroma roles and host-owned composition are sufficient for current consumer experimentation needs.
- **Evidence that would support or weaken the decision:** repeated successful consumer experiments using the existing seams support the decision; repeated cross-consumer duplication or rendering/compatibility failures that cannot be solved at the host boundary weaken it.
- **Review trigger:** multiple consumers independently require the same experiment/variant abstraction, or a host-owned implementation exposes a reproducible contract limitation.
- **Supersession condition:** accepted evidence demonstrates that Phyllotaxis must own reusable experiment state or variant semantics that cannot remain consumer-local.

## Implementation follow-up

No private Phyllotaxis implementation change is required by this ADR.

Consumer repositories may create local experiment work items where a real product experiment is run.

## Reassessment triggers

- multiple consumers independently need the same runtime experiment abstraction;
- host-owned assignment causes a reproducible rendering or compatibility defect;
- an accepted Phyllotaxis feature requires coordinated experiment state across consumers;
- repeated experiment evidence identifies a stable semantic profile or role missing from current contracts.

## Evidence

- [QART-0003 — Consumer experimentation boundary](QART-0003-consumer-experimentation-boundary.md)
- [RFC-0003 — Consumer experimentation boundary](RFC-0003-consumer-experimentation-boundary.md)
- Issue #29
- PR #30
