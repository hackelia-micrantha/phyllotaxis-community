# ADR-0008 — Permit bounded dimensional material in Utility (proposal)

- **Status:** Proposed
- **Date:** 2026-10-07
- **Decision owners:** Phyllotaxis public contract authority
- **Scope:** Utility visual guidance, not stable tokens/components
- **Amends on acceptance:** ADR-0003 (flat composition remains default)

## Context

This proposed decision follows [QART-0008](QART-0008-dimensional-utility-materials.md) and [RFC-0008](RFC-0008-dimensional-utility-materials.md). It remains non-normative until accepted.


ADR-0003 accepted flat low-chroma Utility composition guidance based on a first consumer. Subsequent Digitalis and Envuscator community site styles demonstrate another coherent visual pattern: selective gradient-backed panels, slight bevel/highlight, soft shadows, clear borders, rounded action/status pills, and occasional left-edge emphasis. These are evidence rather than automatic public contract requirements.

The original Utility directive discouraged most gradients and elevation. This unnecessarily restricts a restrained late-1990s desktop/web-inspired material language, provided native semantics, legibility and content-first hierarchy remain intact.

## Proposed decision

Keep Utility and Editorial as the only semantic profiles. Preserve the ADR-0003 flat composition as the least-complex baseline while **permitting**, not mandating, selective dimensional Utility treatment where it reinforces affordance, grouping or hierarchy.

Candidate descriptive treatments for evidence gathering: base, raised, tinted, gloss, inset and accent edge. These are **not** normative CSS custom-property names, stable Chroma roles or Lamina components.

- Prefer a single restrained treatment over stacking gloss, blur, shadow and gradients on every nested surface.
- Dimensional panels must not misleadingly imply clickability; interactive surfaces need appropriate semantics and visible hover/focus/pressed feedback.
- Preserve links as links and use pills for meaningful controls or status, not decoration-only wrappers.
- Chroma owns any future shared values and scheme resolution, Venation remains profile-neutral, and Lamina promotion requires repeated semantic/accessibility evidence.
- Site palettes, botanical motifs and branding remain consumer-owned.

## ADR-0003 relationship

ADR-0003's acceptance of flat low-chroma rhythm, shared separators, compact introductions and stable-API restraint remains valid. Its preference against floating card chrome is a **default**, not a prohibition. No existing public contracts or package exports change from this proposal. If accepted, this ADR would clarify interpretations of ADR-0003 that categorically prohibit bounded gradients, bevels, radius or elevation in Utility.

## Alternatives

1. Strict flat-only Utility: rejected as needlessly restrictive given multiple consumers.
2. New glossy visual profile: rejected because material styling is not a content/task distinction.
3. Immediately standardize surface tokens/components: deferred pending consumer fixtures and independent reuse evidence.
4. Unrestricted site CSS as a system contract: rejected to avoid framework/site coupling and visual entropy.

## Validation / acceptance gate

- Compare neutral flat Utility against restrained tinted/raised/gloss/inset/accent-edge fixtures inspired by Digitalis and Envuscator.
- Test light/dark, forced-colors, focus-visible, keyboard traversal, pointer and non-pointer use, reduced motion, 200% zoom and narrow layouts.
- Ensure text/interactive contrast remains valid across gradients; state meaning is not color-only.
- Measure generated CSS weight and rendering cost against flat baseline; avoid unnecessary filters/backdrop blur.
- Verify CSS-disabled reading order and no-JavaScript functionality.
- Reject surface effects that cause misleading affordance or nested competing elevation.
- Changes to stable Chroma tokens or Lamina APIs require a separate contract with versioning and independent evidence.

## Consequences

Consumers can develop a consistent period-inspired Micrantha material language without making the default surface visually busy. A qualitative review burden remains until reference fixtures and objective thresholds exist. Existing flat Utility consumers remain conforming and should not be automatically restyled.

## References

- [ADR-0003](ADR-0003-utility-composition-patterns.md)
- [Visual directive](../architecture/visual-directive.md)
- [Visual profiles](../architecture/visual-profiles.md)
- [Dimensional Utility reference fixtures](../architecture/dimensional-utility-fixtures.md)
- Public issue #55 and private implementation issue `hackelia-micrantha/phyllotaxis#100`.
