# RFC-0008 — Bounded dimensional material for Utility

- **Status:** Proposed
- **Date:** 2026-10-07
- **Source:** [QART-0008](QART-0008-dimensional-utility-materials.md)
- **Decision status:** Pending. No ADR has been created or accepted for this proposal.

## Problem
The Utility directive treats gradients and elevation as suspect by default, despite a repeatable restrained material language in two independent Micrantha consumer projects. We need explicit permission without new site-specific themes or forced generic components.

## Proposed contract
1. Utility remains the default, primarily content-first, document-like and flat-first.
2. Subtle tint, bevel, shadow, radius and gradient may be applied selectively when they reinforce hierarchy, state, affordance or deliberate period-inspired visual identity.
3. A material effect must not introduce false interactivity, mask semantic state or eliminate obvious native links.
4. Repeated floating cards and stacked effects are discouraged when shared borders and ordinary layout are clearer.
5. The same semantic composition must remain functional without CSS/JS and accessible in light/dark, reduced motion and forced colors.
6. Chroma owns future shared values; Venation remains profile-neutral; Lamina API additions require separate evidence and review.
7. Descriptive candidate treatments (base, raised, tinted, gloss, inset, accent-edge) are **not** stable exports or mandatory tokens.
8. Existing flat Utility consumers remain conforming and production migration is opt-in.

## Relationship to accepted guidance

[ADR-0003](ADR-0003-utility-composition-patterns.md) accepts flat low-chroma rhythm, shared borders and explicit status as the Utility default. This RFC **proposes** clarifying that selective, restrained gradients, bevels, radius and elevation may be appropriate in some consumer-owned designs without replacing that default. Until a subsequent ADR is accepted and the directive is updated through a reviewed change, this RFC and its fixtures are non-normative; consumers and conformance tooling must not treat the proposal as current public permission or a stable component/token contract.

A separate ADR may be numbered and published **only when the decision has been accepted**. No ADR number is reserved by this RFC.

## Verification
Use [F0–F5 fixture matrix](../architecture/dimensional-utility-fixtures.md). Document weakest-point contrast, focus/disabled/pressed visibility, narrow/200% zoom, forced-colors, no-CSS/JS, CSS size and rendering cost. Failing evidence blocks promotion of specific treatments or stable APIs, not retention of valid flat Utility.

## Compatibility
Documentation-only and permissive. No versioned machine contract, CLI, compiled CSS, public package API or migration behavior changes in this RFC.

## Acceptance requirements

- Reconcile the proposed rule against the accepted visual directive and ADR-0003 without weakening the accessibility capability floor or interaction-motion contract.
- Confirm fixture evidence across relevant browsers/conditions and document any outstanding accessibility/performance limitations.
- Treat candidate material names only as descriptive roles; defer versioned token or component design pending independent repeated need.
- Specify compatibility and migration guidance; existing flat Utility consumers must remain conforming and opt-in to changes.
- On an affirmative accepted decision, publish a new numbered ADR and only then update authoritative visual guidance in a separate reviewed change.

## Open decisions
- Which candidate treatments are repeated sufficiently to warrant stable Chroma roles?
- Which measured limits define restrained gloss/bevel and shadow across light/dark schemes?
- Does any use case justify a Lamina component beyond native semantics?
