# RFC-0010 — Native authored semantic text rhythm

- **Status:** Accepted only as non-binding authoring guidance by [ADR-0009](ADR-0009-native-text-rhythm-guidance.md); no new public API or implementation
- **Date:** 2026-10-09
- **Question:** [QART-0010](QART-0010-semantic-text-rhythm.md)
- **Requirement:** [TEXT-001](../requirements/text-rhythm.md)
- **Issue:** [#81](https://github.com/hackelia-micrantha/phyllotaxis-community/issues/81)
- **Visual comparison:** [TEXT-001 static gallery](https://hackelia-micrantha.github.io/phyllotaxis-community/examples/text-rhythm-comparison.html)

## Decision proposed and scope

Recommend **existing native HTML plus accepted `Prose`** for conceptual boundaries. Authors, not style rules or AI, decide where a thought continues, a related section begins, or a genuine thematic break occurs. The existing `Prose` contract preserves authored elements and reading order. Phyllotaxis is not to infer section meaning or add a second content model.

This RFC describes authoring interpretation only, **not** a new conformance requirement, token, component, automatic CSS transform, reader-time runtime, publishing contract, or package behavior.

## Bounded authoring guidance

| Authored relationship | Use | Do not infer |
| --- | --- | --- |
| Continuity of an argument | Ordinary paragraphs | No new semantic divider from margin size |
| Related thought or subsection | Authored paragraph grouping or correctly levelled heading/section | Large blank space does not establish a thematic break |
| True change of scene/topic/movement | Native `<hr>` when a thematic separator is intended | Not a separator for decorative spacing alone |
| Optional ornamental treatment | A consumer-owned `⁂`, `❧` or subtle motif visually accompanying an existing meaningful boundary | Never a substitute for the semantic `hr` or a second accessible separator |

The preferred Utility reference keeps native, restrained presentation. Editorial consumers may opt into a carefully restrained ornament, including none. No profile, density, color scheme or reading preference forces ornamentation.

When the ornament uses an element, mark only the **decorative glyph** `aria-hidden="true"`; preserve the native `hr` as a semantic separator. Avoid making the entire `hr` hidden, and do not generate meaningful content with CSS pseudo-elements. Use a plain native thematic break when glyph support or assistive-technology behavior is uncertain. Actual announcements vary by screen reader and remain subject to the separate manual protocol.

## Single ownership and compatibility

- **Content source and publisher:** chooses block boundaries and authorial intent. No automatic semantic inference at render time.
- **Lamina:** accepted `Prose` remains unchanged; no `ConceptBreak`, `EditorialFlow` or new prop accepted.
- **Chroma and Venation:** spacing values, paragraph/heading measures, density, and section gap decisions remain **exclusively with SPACE-001 / QART-0009 / proposed RFC-0009**. Example-only margin values do not create public tokens.
- **Cambium/CLI/public inspection:** no migration, new CSS variable, stable carrier, machine-readable variant, lint rule or wire-schema change.
- **AI authoring:** optional static **suggestions** may be studied as untrusted draft metadata linked to an exact document revision and block anchor, approved before publication. The example JSON is not a contract; no model can authoritatively alter published prose, bypass review or operate at reader time.
- **Consumers:** existing valid documents continue to render unchanged. New examples are opt-in source-level authoring choices.

## Evidence and limits

The source-only [comparison fixture](../examples/text-rhythm-comparison.html) shows Utility/Editorial × light/dark × four variants. [PR #91](https://github.com/hackelia-micrantha/phyllotaxis-community/pull/91) improved pairing and narrow navigation. [PR #95](https://github.com/hackelia-micrantha/phyllotaxis-community/pull/95) added Chromium native `separator` accessibility-tree checks, `aria-hidden` ornament checks, keyboard focus, forced-colors and CSS-disabled probes. [Landed-main tests](https://github.com/hackelia-micrantha/phyllotaxis-community/actions/runs/37901608930) passed at `0601543762c5df94ac9f046d350d6943cf1a598f`. These checks are automated prerequisites, **not** evidence of actual VoiceOver/NVDA speech or human semantic placement quality.

The decision owner approved the native-first, optional-decoration direction on October 9, 2026. That approval addresses the authoring choice, not missing accessibility testing, consumer preference measurements, static suggestion adoption or runtime scope.

## Alternatives

- **A — Existing native HTML + `Prose`: selected**, with no new public interface.
- **B — Shared semantic spacing/ornament tokens: not selected.** Consumers may style native breaks in their own scope; shared spacing requires separate SPACE-001 evidence and decisions.
- **C — New Lamina concept-break component: deferred.** No independently recurring semantic need that native markup fails to represent has been established.
- **D — Symbol-only, arbitrary margin or automatic insertion: rejected.** This loses meaning or grants authority to visual treatment/model output.

## Acceptance boundary and follow-up

[ADR-0009](ADR-0009-native-text-rhythm-guidance.md) accepts only the no-API guidance. Keep [#81](https://github.com/hackelia-micrantha/phyllotaxis-community/issues/81) open for actual screen-reader observations, human editorial placement and potential *separately authorized* static suggestion research. If later evidence establishes a stable integration problem, reopen an appropriately scoped QART/RFC/ADR. No new default spacing, automatic insertion, runtime adaptation, release or private implementation is implied.
