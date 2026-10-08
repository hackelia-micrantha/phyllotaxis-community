# QART-0008 — Bounded dimensional Utility treatments

- **Status:** Resolved into RFC-0008; limited advisory guidance accepted by [ADR-0008](ADR-0008-dimensional-utility-advisory-guidance.md)
- **Date:** 2026-10-07
- **Authority:** Public design evidence; no stable API decision

## Question
Should Phyllotaxis publish explicit bounded guidance for a repeated class of restrained 1990s software-inspired Utility treatments, or is the accepted product-owned deviation path already sufficient?

## Evidence
Public consumer evidence now shows both ends of the permitted Utility range. Digitalis and Envuscator use tinted gradient regions, softly shadowed panels, bounded rounded controls, pills and left-edge emphasis: [Digitalis CSS](https://github.com/hackelia-micrantha/digitalis-community/blob/c03570962a89f5d77e37ff5e0a7b37a514f59a27/web/styles.css), [Envuscator CSS](https://github.com/hackelia-micrantha/envuscator-community/blob/54119ac6873bce47a47b12a1622c5c213934309b/web/styles.css), and [Envuscator Micrantha CSS](https://github.com/hackelia-micrantha/envuscator-community/blob/54119ac6873bce47a47b12a1622c5c213934309b/web/micrantha.css). By contrast, [Dubnium Community](https://github.com/hackelia-micrantha/dubnium-community/blob/ddff22e61351469b2b512b1002f3bc839e4579a2/site/index.html) deliberately converged on a white, divider-light flat presentation after preview iteration, retaining consumer-owned low-chroma color only as local hover feedback. Source revisions are immutable and publicly inspectable. Together these examples support permission for bounded variation, not a new dimensional default or invariant visual token set.

## Alternatives and trade-offs
1. **Leave accepted guidance unchanged and treat richer treatments as product-owned deviations.** The current visual directive already permits concrete semantic, usability, accessibility, editorial, or product-driven deviations from the flat-first default. The accepted accessibility capability floor already governs contrast, focus, forced-colors, zoom/reflow and related evidence, while the interaction-motion contract already governs false affordance and movement. This option therefore has the lowest contract churn and already accommodates Digitalis/Envuscator. Its remaining gap is narrower: no shared reviewed vocabulary exists for dimensional composition itself—such as when stacked gloss/shadow/radius becomes excessive, how relative elevation should express hierarchy, or how inset/bevel treatments remain subordinate to document flow.
2. **Publish bounded treatments as non-normative Utility guidance.** Make the repeated class explicit enough to review consistently while preserving the existing deviation mechanism, semantic boundaries and backwards compatibility. Minimal/flat consumers remain first-class conforming outcomes; qualitative restraint still requires fixture evidence. **Recommended.**
3. **Create a third material visual profile.** Conflates content/task model and cosmetic appearance.
4. **Immediately add Chroma roles and Lamina wrappers.** Premature API commitment; duplicated or incompatible semantics likely.

## Risks
- Cross-cutting accessibility and false-affordance risks are already governed by the accepted accessibility and interaction-motion contracts; this decision must reference rather than duplicate those authorities.
- Dimensional-specific risks include nested visual noise, competing elevation/hierarchy, stacked effects that overpower document flow, and rendering cost.
- Private implementation diverging before the public contract is accepted.
- Accidental normalization of consumer-specific decoration.

## Evidence gap and decision gate
Test F0–F5 in [reference fixtures](../architecture/dimensional-utility-fixtures.md), record measured accessibility and rendering outcomes, and require independent consumer evidence before stable API promotion. No production consumer restyling implied.

## Disposition
The alternatives analysis is complete and advances to [RFC-0008](RFC-0008-dimensional-utility-materials.md) because repeated independent consumer evidence justifies reviewing whether explicit shared bounds improve consistency over the already-valid local-deviation path. The limited **advisory** review direction is accepted by [ADR-0008](ADR-0008-dimensional-utility-advisory-guidance.md); [ADR-0003](ADR-0003-utility-composition-patterns.md) and the current Utility visual directive remain the unchanged normative baseline.
