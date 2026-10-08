# RFC-0008 — Bounded dimensional material for Utility

- **Status:** Accepted as advisory composition-review guidance by [ADR-0008](ADR-0008-dimensional-utility-advisory-guidance.md)
- **Date:** 2026-10-07
- **Source:** [QART-0008](QART-0008-dimensional-utility-materials.md)
- **Decision status:** The limited advisory direction is accepted by [ADR-0008](ADR-0008-dimensional-utility-advisory-guidance.md); this is not a new styling default, component or token contract.

## Problem
The Utility directive is flat-first and treats gradients/elevation as suspect by default, but it already permits justified product-owned deviations. Consumer evidence now spans both repeated richer dimensional treatments and a deliberately minimal white/flat composition. The open question is therefore not whether richer treatment is permitted at all, but whether a repeated cross-consumer class warrants explicit shared review bounds without becoming a Utility default, site-specific theme, or generic component API.

## Reviewed guidance — accepted only as advisory review criteria

The numbered considerations below are **not additional machine-enforceable conformance requirements**. The accepted Utility directive and cross-cutting accessibility/interaction decisions remain normative.

1. Utility remains the default, primarily content-first, document-like and flat-first.
2. Subtle tint, bevel, shadow, radius and gradient may be applied selectively when they reinforce hierarchy or deliberate period-inspired visual identity.
3. The accepted [accessibility capability floor](../requirements/accessibility.md) and [interaction-motion contract](../architecture/interaction-motion.md) remain the sole cross-cutting authorities for contrast, focus, forced-colors, zoom/reflow, reduced motion, false affordance and movement. This RFC adds no competing rules for those concerns.
4. Dimensional composition should remain sparse: avoid stacking gloss, large radius, broad shadow and raised treatment on the same ordinary content region; prefer ordinary document flow when elevation does not communicate a distinct hierarchy.
5. Inset or bevel treatment should remain subordinate to the surrounding reading flow and must not become a generic wrapper for static content.
6. Chroma owns future shared values; Venation remains profile-neutral; Lamina API additions require separate evidence and review.
7. Descriptive candidate treatments (base, raised, tinted, gloss, inset, accent-edge) are **not** stable exports or mandatory tokens.
8. Existing flat Utility consumers remain first-class conforming outcomes; persistent dimensional treatment is never required and production migration is opt-in.

## Relationship to accepted guidance

[ADR-0003](ADR-0003-utility-composition-patterns.md) accepts flat low-chroma rhythm, shared borders and explicit status as the Utility default, and the accepted visual directive already permits concrete product-owned deviations. Digitalis/Envuscator provide repeated richer-treatment evidence, while the pinned Dubnium Community consumer provides a minimal white/flat control that intentionally removes persistent section color and dividers. ADR-0008 **accepts shared non-binding review advice for this repeated deviation class**; it does not create permission that was previously absent, replace the flat-first default, or make dimensional treatment preferable. Consumers and conformance tooling must not treat these observations as mandatory style requirements, public API exports, or accessibility certification.

[ADR-0008](ADR-0008-dimensional-utility-advisory-guidance.md) is the accepted decision. Existing normative visual guidance remains authoritative and unchanged.

## Verification
Use [F0–F5 fixture matrix](../architecture/dimensional-utility-fixtures.md). Accessibility and interaction checks exercise the already-accepted cross-cutting contracts; RFC-0008-specific evidence compares dimensional composition, relative hierarchy, stacking restraint, CSS size and rendering cost against F0. Failing evidence blocks promotion of specific treatments or stable APIs, not retention of valid flat Utility.

## Preliminary composition review used for the limited advisory decision

The [B1–B3 visual assessment](../architecture/dimensional-utility-composition-assessment.md) records assistant-assisted observations of the reproducible Chromium/Firefox fixture captures: one restrained differentiated region is a reasonable opt-in candidate; nested gloss/elevation stacking is a negative example; differentiated action-vs-read-only hierarchy is preferable to equal elevation. This remains qualitative review, **not independent human approval**, not accessibility conformance, and not a decision to change accepted guidance.

The limited **advisory composition-review direction is accepted by ADR-0008**. The qualitative visual observations remain provisional and are not independent human validation of the B1–B3 examples. Evidence does not yet justify stable Chroma/Lamina roles or automatic migration. Browser zoom, text resizing and assistive-technology gaps remain open, not passed.

## Compatibility
Documentation-only and permissive. No versioned machine contract, CLI, compiled CSS, public package API or migration behavior changes in this RFC.

## Additional requirements before any stronger conformance or stable API promotion

- Reconcile the proposed rule against the accepted visual directive and ADR-0003 without weakening the accessibility capability floor or interaction-motion contract.
- Confirm fixture evidence across relevant browsers/conditions and document any outstanding accessibility/performance limitations.
- Treat candidate material names only as descriptive roles; defer versioned token or component design pending independent repeated need.
- Specify compatibility and migration guidance; existing flat Utility consumers must remain conforming and opt-in to changes.
- ADR-0008 accepts **only advisory review guidance**. Any later proposal to change normative visual requirements must follow a separate reviewed contract decision and update. No normative directive change is required or authorized by this advisory decision.

## Open decisions
- Which candidate treatments are repeated sufficiently to warrant stable Chroma roles?
- Which measured limits define restrained gloss/bevel and shadow across light/dark schemes?
- Does any use case justify a Lamina component beyond native semantics?
