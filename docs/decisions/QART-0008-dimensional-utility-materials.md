# QART-0008 — Bounded dimensional Utility treatments

- **Status:** Resolved into RFC-0008; RFC proposal remains under review
- **Date:** 2026-10-07
- **Authority:** Public design evidence; no stable API decision

## Question
Does the flat-first Utility guidance in ADR-0003 unnecessarily exclude a coherent restrained 1990s software-inspired material treatment observed in Digitalis and Envuscator consumers?

## Evidence
Current public consumer styles include tinted gradient regions, softly shadowed panels, bounded rounded controls, pills and left-edge emphasis. See pinned, publicly inspectable source files: [Digitalis CSS](https://github.com/hackelia-micrantha/digitalis-community/blob/c03570962a89f5d77e37ff5e0a7b37a514f59a27/web/styles.css), [Envuscator CSS](https://github.com/hackelia-micrantha/envuscator-community/blob/54119ac6873bce47a47b12a1622c5c213934309b/web/styles.css), and [Envuscator Micrantha CSS](https://github.com/hackelia-micrantha/envuscator-community/blob/54119ac6873bce47a47b12a1622c5c213934309b/web/micrantha.css). Source revisions and content were verified at the linked commits. These are examples rather than invariant visual tokens or proof that every effect is needed.

## Alternatives and trade-offs
1. **Preserve strict flat-first guidance only.** Lowest API/design risk, but rejects legitimate consumer variation.
2. **Permit bounded treatments as non-normative Utility guidance.** Maintains semantic boundaries and backwards compatibility; qualitative restraint needs fixture evidence. **Recommended.**
3. **Create a third material visual profile.** Conflates content/task model and cosmetic appearance.
4. **Immediately add Chroma roles and Lamina wrappers.** Premature API commitment; duplicated or incompatible semantics likely.

## Risks
- Static cards mistaken for controls, contrast loss across gradients, invisible focus under shadows, forced-color boundaries lost, nested visual noise, rendering cost.
- Private implementation diverging before the public contract is accepted.
- Accidental normalization of consumer-specific decoration.

## Evidence gap and decision gate
Test F0–F5 in [reference fixtures](../architecture/dimensional-utility-fixtures.md), record measured accessibility and rendering outcomes, and require independent consumer evidence before stable API promotion. No production consumer restyling implied.

## Disposition
The alternatives analysis is complete and advances to [RFC-0008](RFC-0008-dimensional-utility-materials.md) for review of a bounded permissive rule. The RFC is **proposed, not accepted**; [ADR-0003](ADR-0003-utility-composition-patterns.md) and the current Utility visual directive remain authoritative.
