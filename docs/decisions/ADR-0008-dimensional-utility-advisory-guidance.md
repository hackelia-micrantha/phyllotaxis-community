# ADR-0008 — Accept advisory bounds for dimensional Utility composition

- **Status:** Accepted
- **Date:** 2026-10-08
- **Decision owners:** Phyllotaxis public contract authority
- **Scope:** Advisory review of optional, product-owned Utility presentation
- **Supersedes:** None
- **Superseded by:** None

## Context

[ADR-0003](ADR-0003-utility-composition-patterns.md) and the accepted [Utility visual directive](../architecture/visual-directive.md) prefer flat, document-like presentation, shared separators, system typography, and explicit state text. They already allow a justified product-specific departure from the flat default. Repeated Digitalis and Envuscator examples use restrained tint, limited roundness, gradients and elevation; a separately pinned Dubnium Community example deliberately removes persistent dimensional decoration. The design decision is how to review this variation consistently, not whether to replace the default or create styling permission that did not exist.

[QART-0008](QART-0008-dimensional-utility-materials.md) evaluated keeping deviations entirely consumer-owned, issuing advisory guidance, creating a new visual profile, or immediately exporting shared material tokens/components. [RFC-0008](RFC-0008-dimensional-utility-materials.md) proposed bounded review guidance. The [F0–F5 reference](../architecture/dimensional-utility-fixtures.md), [B1–B3 boundary examples](../examples/dimensional-utility-boundaries.html) and [preliminary visual assessment](../architecture/dimensional-utility-composition-assessment.md) distinguish a restrained candidate from deliberately excessive or ambiguous compositions.

The decision owner approved the **limited advisory direction**, not certification of the example, final human usability validation, stable design tokens, or a production migration.

## Decision

**Accept RFC-0008 only as advisory, non-machine-normative composition-review guidance.** This specializes the interpretation of existing consumer-owned deviations without changing the Utility default or expanding public package contracts.

1. **Flat-first Utility remains authoritative.** Ordinary documentation, status, administrative and application surfaces should continue to prefer natural document flow, compact spacing, contiguous or shared borders, familiar links and native controls. A consumer need not use gradients, shadows, gloss, bevels or rounded cards to conform.
2. **One purposeful differentiated region may be reasonable.** A consumer may opt into restrained low-chroma tint, border and shallow elevation when that individual region's task or semantics benefit from additional visual hierarchy. No specific gradient, shadow, radius, hue or depth value is standardized by this decision.
3. **Do not recommend decoration stacked without purpose.** Repeated nested gloss, shadows, large radii and raised panels enclosing the same ordinary content are a *negative reference example*. This is a review heuristic, not a blanket prohibition on nesting for genuinely distinct task semantics.
4. **Elevation must not invent affordances.** A raised actionable area next to an inset/read-only region may be clearer than two equally raised peers. Keep actual native control semantics and visible status text; do not infer proven task success or deception from a screenshot alone.
5. **Accessibility and interaction authority do not move.** [ADR-0004](ADR-0004-accessibility-capability-floor.md), the [accessibility capability floor](../requirements/accessibility.md), [ADR-0005](ADR-0005-interaction-motion.md), and the [interaction-motion contract](../architecture/interaction-motion.md) govern focus, contrast, state signaling, high contrast, keyboard input, zoom/reflow, text spacing, target size and reduced motion. This ADR adds no competing thresholds or exemptions.
6. **Treat examples as evidence, not stable APIs.** `base`, `tinted`, `raised`, `gloss`, `inset`, and `accent-edge` remain descriptive labels. No new Chroma token, Lamina generic Card/Pill/Badge/Tag, Venation layout primitive, profile selection, CLI contract, or Cambium rewrite is created or reserved.
7. **Interpretive tooling stays advisory.** Mechanical observations may be reported with evidence, but subjective nesting, restraint, affordance or visual-hierarchy findings must not become fail-closed conformance rules or automatic migrations. Actual consumer integration requires its own review.
8. **Consumer adoption is opt-in.** No production site, release, package build or private implementation is authorized by this decision.

The adopted scope is narrower than promoting a new design vocabulary: it is a reusable *review question*, not a compulsory appearance.

## Alternatives and rationale

- **Leave all dimensional decisions unrecorded:** Preserves the smallest public surface, but repeats the same avoidable review ambiguity across independent consumers. Not selected.
- **Accept advisory guidance only:** **Selected.** It captures defensible comparative lessons without freezing consumer-owned CSS or encouraging decoration by default.
- **Create a third material visual profile:** Rejected because visual profiles follow the primary task/content model, not gloss or a desired era of appearance.
- **Export shared Chroma/Lamina material APIs now:** Rejected because the fixtures, incomplete accessibility coverage, and current consumer diversity do not establish stable semantic roles or migration needs.
- **Require dimensional restyling of Utility:** Rejected because it would conflict with the flat-first default and valid minimal consumers.

## Evidence and accepted limitations

- [PR #56](https://github.com/hackelia-micrantha/phyllotaxis-community/pull/56) published QART/RFC and reference fixtures.
- [PR #58](https://github.com/hackelia-micrantha/phyllotaxis-community/pull/58) added public Chromium/Firefox harness coverage.
- [PR #64](https://github.com/hackelia-micrantha/phyllotaxis-community/pull/64) added B1/B2/B3 and reproducible checks, using harness `0.2.0`.
- [Evidence workflow #37745594999](https://github.com/hackelia-micrantha/phyllotaxis-community/actions/runs/37745594999) reported two browsers, zero harness failures, zero required failures and **sixteen unsupported observations**; artifact digest `sha256:d77aee141ef0a321178e0c715a627b4c900e56de5f0ec9be056b94f5489dc677`.
- [PR #65](https://github.com/hackelia-micrantha/phyllotaxis-community/pull/65) documented **assistant-assisted preliminary visual interpretation**, not independent human visual sign-off.

Unsupported evidence is not passed evidence. Actual browser 200% zoom, text-only resize and spacing, constrained Firefox window sizes, some high-contrast/reduced-motion conditions, representative assistive technology, task/affordance evaluation, and full production render cost remain unproven. Those gaps are acceptable for recording **non-binding review advice**, but block stronger conformance, accessibility certification, and stable API claims.

## Consequences and compatibility

**Benefits:** Reviewers may consistently ask whether depth has a purpose, whether hierarchy is clear, whether static regions falsely look actionable, and whether flat presentation remains a better fit.

**Costs:** Advice is qualitative and may vary across contexts. Consumers may keep local material values until genuinely repeated semantic requirements justify a separate public contract.

**No migration:** `ADR-0003` and the accepted visual directive remain normative; no currently valid Utility consumer becomes non-conforming. This ADR **does not amend** those defaults. It does not require edits to the normative directive or profile definition; a later reviewed cross-reference may improve discoverability but must not silently convert this advice into a mandatory rule. Public interface schemas, CLI contracts, runtime/packages and private implementation remain unchanged.

## Follow-up and reassessment

- Record independent human hierarchy/semantic review under [issue #63](https://github.com/hackelia-micrantha/phyllotaxis-community/issues/63); do not represent the prior screenshot review as such.
- Keep platform, zoom, resize and accessibility evidence gaps tracked independently of this advisory decision.
- Reconsider stable tokens/components only with repeated independent consumer need, versioned contract proposal, compatibility plan and comprehensive accessibility evidence.
- Revisit this advice if it encourages false affordances, repeated decorative nesting, material browser performance costs, or interpretation that overrides the flat-first default.

## Authority references

- [QART-0008](QART-0008-dimensional-utility-materials.md)
- [RFC-0008](RFC-0008-dimensional-utility-materials.md)
- [ADR-0003](ADR-0003-utility-composition-patterns.md)
- [B1–B3 qualitative assessment](../architecture/dimensional-utility-composition-assessment.md)
- [Issue #55](https://github.com/hackelia-micrantha/phyllotaxis-community/issues/55)
