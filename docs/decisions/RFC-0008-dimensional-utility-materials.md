# RFC-0008 — Bounded dimensional material for Utility

- **Status:** Proposed
- **Date:** 2026-10-07
- **Source:** [QART-0008](QART-0008-dimensional-utility-materials.md)
- **Decision status:** Pending. No ADR has been created or accepted for this proposal.

## Problem
The Utility directive is flat-first and treats gradients/elevation as suspect by default, but it already permits justified product-owned deviations. Consumer evidence now spans both repeated richer dimensional treatments and a deliberately minimal white/flat composition. The open question is therefore not whether richer treatment is permitted at all, but whether a repeated cross-consumer class warrants explicit shared review bounds without becoming a Utility default, site-specific theme, or generic component API.

## Proposed contract
1. Utility remains the default, primarily content-first, document-like and flat-first.
2. Subtle tint, bevel, shadow, radius and gradient may be applied selectively when they reinforce hierarchy or deliberate period-inspired visual identity.
3. The accepted [accessibility capability floor](../requirements/accessibility.md) and [interaction-motion contract](../architecture/interaction-motion.md) remain the sole cross-cutting authorities for contrast, focus, forced-colors, zoom/reflow, reduced motion, false affordance and movement. This RFC adds no competing rules for those concerns.
4. Dimensional composition should remain sparse: avoid stacking gloss, large radius, broad shadow and raised treatment on the same ordinary content region; prefer ordinary document flow when elevation does not communicate a distinct hierarchy.
5. Inset or bevel treatment should remain subordinate to the surrounding reading flow and must not become a generic wrapper for static content.
6. Chroma owns future shared values; Venation remains profile-neutral; Lamina API additions require separate evidence and review.
7. Descriptive candidate treatments (base, raised, tinted, gloss, inset, accent-edge) are **not** stable exports or mandatory tokens.
8. Existing flat Utility consumers remain first-class conforming outcomes; persistent dimensional treatment is never required and production migration is opt-in.

## Relationship to accepted guidance

[ADR-0003](ADR-0003-utility-composition-patterns.md) accepts flat low-chroma rhythm, shared borders and explicit status as the Utility default, and the accepted visual directive already permits concrete product-owned deviations. Digitalis/Envuscator provide repeated richer-treatment evidence, while the pinned Dubnium Community consumer provides a minimal white/flat control that intentionally removes persistent section color and dividers. This RFC **proposes shared non-normative review bounds for that repeated deviation class**; it does not create permission that was previously absent, replace the flat-first default, or make dimensional treatment preferable. Until a subsequent ADR is accepted and the directive is updated through a reviewed change, this RFC and its fixtures are non-normative; consumers and conformance tooling must not treat the proposal as current public permission or a stable component/token contract.

A separate ADR may be numbered and published **only when the decision has been accepted**. No ADR number is reserved by this RFC.

## Verification
Use [F0–F5 fixture matrix](../architecture/dimensional-utility-fixtures.md). Accessibility and interaction checks exercise the already-accepted cross-cutting contracts; RFC-0008-specific evidence compares dimensional composition, relative hierarchy, stacking restraint, CSS size and rendering cost against F0. Failing evidence blocks promotion of specific treatments or stable APIs, not retention of valid flat Utility.

## Preliminary composition review (not acceptance)

The [B1–B3 visual assessment](../architecture/dimensional-utility-composition-assessment.md) records assistant-assisted observations of the reproducible Chromium/Firefox fixture captures: one restrained differentiated region is a reasonable opt-in candidate; nested gloss/elevation stacking is a negative example; differentiated action-vs-read-only hierarchy is preferable to equal elevation. This remains qualitative review, **not independent human approval**, not accessibility conformance, and not a decision to change accepted guidance.

Suggested next disposition: **revise toward advisory composition-review bounds**, then obtain explicit human review and a separately accepted decision if warranted. Evidence does not yet justify any stable Chroma/Lamina role or automatic migration. Missing browser zoom/text resize and assistive-technology conditions remain open rather than passed.

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
