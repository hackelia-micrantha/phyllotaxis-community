# TEXT-001 — Semantic text rhythm and conceptual breaks

- **Status:** Proposed design requirement; not an accepted contract or shipped behavior
- **Date:** 2026-10-08
- **Tracking:** [#81](https://github.com/hackelia-micrantha/phyllotaxis-community/issues/81)
- **Analysis:** [QART-0010](../decisions/QART-0010-semantic-text-rhythm.md)
- **Adjacent scope:** [SPACE-001](spatial-rhythm.md) and [QART-0009](../decisions/QART-0009-spatial-rhythm.md)

## Goal

Make **space between ideas** a deliberate part of reading rhythm. Distinguish continuity within one argument, a related thought transition, and a true thematic/conceptual break. Content meaning and visual density are not equivalent: a large blank margin cannot reliably replace a meaningful document boundary.

This extends SPACE-001's reading-measure/paragraph concerns without replacing its layout-spacing scope. It applies to genuine prose under both Utility and Editorial profiles, including reference documents, engineering essays, and longer narrative articles. Utility must not be reclassified as Editorial merely because text is long.

## Proposed reading relationships

| Relationship | Authored meaning | Candidate rendering | Semantic source |
| --- | --- | --- | --- |
| Continuation | Next paragraph supports the same argument | ordinary paragraph rhythm | paragraphs / existing DOM |
| Thought transition | A closely related, distinct thought | wider but bounded paragraph group separation | authored paragraph/section structure; no implied new semantic element |
| Thematic break | A scene, movement, topic, or argument ends; another begins | larger separation; optional ornament | native `<hr>` when a true thematic break, or author-defined section/heading |

Authors choose the semantic boundaries. Layout choices are not a machine's authority to change the document meaning. Heading levels reflect document outline, never only visual emphasis. A symbol is an *optional rendering* of an already-established boundary, not an independent semantic marker.

Examples (illustrative **authored HTML**, not a new package API):

```html
<div class="article-prose">
  <p>An observation introduces an argument.</p>
  <p>Evidence continues that argument.</p>
  <hr>
  <p>A different movement begins.</p>
</div>
```

A decorative asterism (`⁂`), fleuron (`❧`), or geometric glyph could replace the visual line without altering native `<hr>` semantics, provided the ornament is not separately announced. If a separator is merely decorative rather than thematic, do not manufacture an `<hr>` just to obtain a glyph. CSS/markup options require assistive-technology review; CSS-generated text can sometimes be announced, so do not assume pseudo-element glyphs are silent.

## Ownership and integration boundaries

- **Content/authoring pipeline:** owns document blocks, headings, authored breaks, and human approval of suggestions. AI never becomes a source of truth for prose or reading order.
- **Chroma:** owns typography and spacing values, profile/scheme resolution, and any *future accepted* separator appearance roles.
- **Venation:** owns structural relationships *between sections/containers* under accepted constrained primitives. It must not become a text-analysis engine or margin passthrough.
- **Lamina:** existing accepted `Prose` presents authored native HTML without inferring/reordering it. Proposed prose-break treatment can be evaluated inside that boundary before a distinct `ConceptBreak`/`EditorialFlow` component is justified.
- **Cambium:** may later provide opt-in, previewable migrations from authored legacy break patterns. It must not infer semantics from margins or silently rewrite prose.
- **Amaryllis (candidate optional integration):** may supply inference or adaptation through a separately versioned, authorized integration; no assumed current web API or runtime capability. Phyllotaxis remains deterministic and usable without AI.

No fifth design-system layer or general AI provider is proposed.

## Manual, static-assisted and runtime-assisted modes

1. **Manual baseline:** author-created paragraphs, headings, sections and thematic breaks are authoritative. Works in SSR, Markdown/HTML, without JavaScript or AI.
2. **Static AI suggestions (preferred experiment):** a separate authoring/build process may suggest *between-block* boundaries. Each suggestion is bound to an exact content revision and stable block anchor. An editor accepts/rejects suggestions or a documented publisher policy evaluates them before publishing. Resulting published HTML is deterministic, reviewable, and does not require inference at read time.
3. **Dynamic presentation adaptation (research only):** an explicitly opted-in client may adjust *presentation density* while preserving accepted block boundaries, DOM order, text, scroll anchor and explicit user preference. Dynamic insertion/removal of semantic breaks, continuous reflow during reading, or mandatory client inference is not an accepted behavior. Test SSR/hydration, layout shift and storage/data-handling policy before any runtime experiment.

Illustrative **candidate suggestion record**, not a JSON schema, released API, or wire protocol:

```json
{
  "documentRevision": "sha256:…",
  "afterBlockId": "p-0012",
  "kind": "thematic-break",
  "suggestedStrength": "major",
  "ornamentPreference": "optional",
  "source": "inference",
  "modelRevision": "documented-model-id",
  "reviewState": "pending"
}
```

A suggestion must never be applied if the content revision or anchor is missing/ambiguous. Numeric confidence may assist editorial triage, but it is not proof of semantic correctness or an authorization threshold. Provenance can include inference policy version, prompt/analysis version, document identity, and approval, with privacy-safe retention.

## Safety, compatibility, and accessibility invariants

1. **Authored meaning wins:** no insertions inside sentences, headings, links, list items, tables, code blocks, quotations, figures, footnotes, or interactive widgets. Proposed insertion sites are block boundaries only; preserve references and reading order.
2. **Accessible separator semantics:** distinguish native `<hr>` thematic breaks from decorative graphics; present exactly one sensible assistive-technology representation. A decorative symbol must not add duplicate speech or become the sole carrier of meaning. Test forced colors, high contrast, text scaling, copy/paste and non-CSS output.
3. **Predictable typography:** width/line length, paragraph gap, heading adjacency and section/break spacing must compose without accidental doubling. Long documents remain usable at 320 CSS px and 200% resize, with user text-spacing overrides.
4. **Non-intrusive controls:** decorative selection does not introduce hover requirements, animation, required network fetches, additional focus stops, hidden text, or CSS-only content necessary to understand the document.
5. **No unsanctioned inference:** an AI suggestion is untrusted data, schema-validated and safely rendered; never execute model-authored markup/CSS/JS. Do not transmit private document text to an external service without explicit host policy, user authorization where required, retention constraints, and auditability.
6. **Reading stability:** no automatic scroll jumps or changes in semantic breaks during a reading session; avoid hydration differences or costly layout measurement loops. Treat cumulative layout shift, input responsiveness, CSS/JS footprint and render overhead as evidence questions under [PERF-001](performance.md), without invented thresholds.
7. **Backwards compatibility:** existing Utility/Editorial default typography, accepted `Prose`, Chroma CSS variables, Venation layout props and public inspection v1 remain unchanged until QART -> RFC -> ADR. Absence of markers must preserve current rendering.
8. **User autonomy:** preference for denser/spacious presentation and reduced ornament should remain explicit, recoverable and compatible with ordinary browser settings; profile/scheme/density/break-strength concepts must not be conflated.

## Evidence required before promoting stable APIs

Compare authored baseline, manually marked transitions, native thematic breaks with/without ornament and static-suggestion output on representative reference prose and Editorial prose. Include:
- Utility and Editorial; light and dark; widths 320, 375, 768, 1280 CSS px.
- Compact and generous **consumer experiments** without silently changing accepted defaults.
- At least one text-heavy page, a code/table/figure-heavy article, mixed headings/lists, localization expansion, and a multi-section narrative.
- 200% text resize, WCAG text-spacing overrides, keyboard and screen-reader reading order, high contrast/forced colors, CSS disabled, no JavaScript and SSR/hydration.
- Screen-reader thematic-break announcement vs visual ornament; browser scroll position during preference changes.
- Repeatable qualitative human editorial review for correct semantic placement, including misleading AI insertions; negative/adversarial samples.
- Paired baseline measurements for layout shift/render/CSS/JS payload where implementation changes are later proposed.

A static demonstration may be published as an explicitly **non-normative** gallery fixture. A visual comparison or automated scan alone is not evidence of semantic correctness or WCAG conformance.

## Decision path

[QART-0010](../decisions/QART-0010-semantic-text-rhythm.md) compares the native baseline, bounded styling roles, new components, and AI modes. Only after evidence resolves open questions should a corresponding RFC specify proposed stable values/components/schema, then an ADR decide adoption. Private implementation and AI integration follow an accepted, immutable pinned public contract, with exact-head testing and compatibility evidence.

This document does **not** authorize new stable CSS properties, a `ConceptBreak` export, an Amaryllis inference protocol, auto-insertion, publication, or changes to the accepted contracts.
